import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_DATA_PATH = path.resolve(__dirname, '../data/users.json');

// Ensure data directory exists
const ensureDataDir = () => {
    const dir = path.dirname(USER_DATA_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(USER_DATA_PATH)) {
        fs.writeFileSync(USER_DATA_PATH, JSON.stringify([]));
    }
};

export const saveUser = async (userData) => {
    // Always try MongoDB first as it's the primary source of truth
    let mongoUser = null;
    try {
        mongoUser = await User.create(userData);
    } catch (error) {
        console.warn('MongoDB save failed, continuing to JSON (if non-production):', error.message);
    }

    // Backup to JSON (Local development only, as Netlify/Vercel are read-only)
    const isServerless = !!(process.env.NETLIFY || process.env.VERCEL || process.env.LAMBDA_TASK_ROOT);

    if (!isServerless) {
        try {
            ensureDataDir();
            const users = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
            users.push({
                ...userData,
                _id: mongoUser ? mongoUser._id : Date.now().toString(),
                createdAt: new Date().toISOString()
            });
            fs.writeFileSync(USER_DATA_PATH, JSON.stringify(users, null, 2));
        } catch (err) {
            console.error('JSON save failed:', err.message);
        }
    }

    return mongoUser;
};

export const findUserByEmail = async (email) => {
    // Try MongoDB
    try {
        const user = await User.findOne({ email }).select('+password');
        if (user) return user;
    } catch (error) {
        console.warn('MongoDB search failed, checking JSON:', error.message);
    }

    // Try JSON fallback
    try {
        if (fs.existsSync(USER_DATA_PATH)) {
            const users = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
            const user = users.find(u => u.email === email);
            if (user) {
                // Return a mock mongoose-like object if needed, or just the raw object
                return user;
            }
        }
    } catch (err) {
        console.error('JSON search failed:', err.message);
    }

    return null;
};
