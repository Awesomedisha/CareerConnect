import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_DATA_PATH = path.resolve(__dirname, '../data/users.json');

const isServerless = !!(process.env.NETLIFY || process.env.VERCEL || process.env.LAMBDA_TASK_ROOT);

// Ensure data directory exists
const ensureDataDir = () => {
    const dir = path.dirname(USER_DATA_PATH);
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
            // Read-only on serverless
        }
    }
    if (!fs.existsSync(USER_DATA_PATH)) {
        try {
            fs.writeFileSync(USER_DATA_PATH, JSON.stringify([]));
        } catch (e) {
            // Read-only on serverless
        }
    }
};

export const saveUser = async (userData) => {
    let savedUser = null;

    // PRIMARY: MongoDB (Always the source of truth for persistence)
    try {
        savedUser = await User.create(userData);
    } catch (error) {
        console.error('CRITICAL: MongoDB save failed:', error.message);
        // If on Localhost, we can still use JSON as a primary fallback
        if (isServerless) {
            throw new Error('Database connection failed in production. Registration aborted to prevent data loss.');
        }
    }

    // SECONDARY: JSON (Local development backup only)
    if (!isServerless) {
        try {
            ensureDataDir();
            const users = fs.existsSync(USER_DATA_PATH) ? JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8')) : [];
            const newUser = {
                ...userData,
                _id: savedUser ? savedUser._id : Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            fs.writeFileSync(USER_DATA_PATH, JSON.stringify(users, null, 2));
            if (!savedUser) savedUser = newUser;
        } catch (err) {
            console.warn('JSON backup failed (Local):', err.message);
        }
    }

    return savedUser;
};

export const findUserByEmail = async (email) => {
    // PRIMARY: MongoDB
    try {
        const user = await User.findOne({ email }).select('+password');
        if (user) return user;
    } catch (error) {
        console.error('CRITICAL: MongoDB search failed:', error.message);
        if (isServerless) {
            throw new Error('Database connection failed in production.');
        }
    }

    // SECONDARY: JSON fallback (Localhost only)
    if (!isServerless) {
        try {
            if (fs.existsSync(USER_DATA_PATH)) {
                const users = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
                const user = users.find(u => u.email === email);
                if (user) return user;
            }
        } catch (err) {
            console.warn('JSON backup search failed (Local):', err.message);
        }
    }

    return null;
};
