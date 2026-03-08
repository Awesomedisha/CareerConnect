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
            // Might fail on read-only serverless, but we handle it
        }
    }
    if (!fs.existsSync(USER_DATA_PATH)) {
        try {
            fs.writeFileSync(USER_DATA_PATH, JSON.stringify([]));
        } catch (e) {
            // Might fail on read-only serverless
        }
    }
};

export const saveUser = async (userData) => {
    let savedUser = null;

    if (isServerless) {
        // Platform preference: Try JSON first (even if transient)
        try {
            ensureDataDir();
            const users = fs.existsSync(USER_DATA_PATH) ? JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8')) : [];
            const newUser = {
                ...userData,
                _id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            try {
                fs.writeFileSync(USER_DATA_PATH, JSON.stringify(users, null, 2));
                savedUser = newUser;
            } catch (e) {
                console.warn('JSON write failed (as expected on serverless):', e.message);
            }
        } catch (err) {
            console.error('JSON logic failed:', err.message);
        }

        // Try MongoDB as backup if configured
        if (!savedUser) {
            try {
                savedUser = await User.create(userData);
            } catch (error) {
                console.error('MongoDB backup save failed:', error.message);
            }
        }
    } else {
        // Local preference: MongoDB first
        try {
            savedUser = await User.create(userData);
        } catch (error) {
            console.warn('MongoDB save failed, falling back to JSON:', error.message);
        }

        // Backup to JSON
        try {
            ensureDataDir();
            const users = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
            users.push({
                ...userData,
                _id: savedUser ? savedUser._id : Date.now().toString(),
                createdAt: new Date().toISOString()
            });
            fs.writeFileSync(USER_DATA_PATH, JSON.stringify(users, null, 2));
            if (!savedUser) savedUser = users[users.length - 1];
        } catch (err) {
            console.error('JSON save failed:', err.message);
        }
    }

    return savedUser;
};

export const findUserByEmail = async (email) => {
    if (isServerless) {
        // Priority: JSON
        try {
            if (fs.existsSync(USER_DATA_PATH)) {
                const users = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
                const user = users.find(u => u.email === email);
                if (user) return user;
            }
        } catch (err) {
            console.warn('JSON search failed:', err.message);
        }

        // Fallback: MongoDB
        try {
            const user = await User.findOne({ email }).select('+password');
            if (user) return user;
        } catch (error) {
            console.error('MongoDB backup search failed:', error.message);
        }
    } else {
        // Priority: MongoDB
        try {
            const user = await User.findOne({ email }).select('+password');
            if (user) return user;
        } catch (error) {
            console.warn('MongoDB search failed, checking JSON:', error.message);
        }

        // Fallback: JSON
        try {
            if (fs.existsSync(USER_DATA_PATH)) {
                const users = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
                const user = users.find(u => u.email === email);
                if (user) return user;
            }
        } catch (err) {
            console.error('JSON search failed:', err.message);
        }
    }

    return null;
};
