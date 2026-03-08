import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_DATA_PATH = path.resolve(__dirname, './data/users.json');

console.log('--- Diagnostic Start ---');
console.log('Environment:', process.env.NODE_ENV);
console.log('Checking JSON storage at:', USER_DATA_PATH);

if (fs.existsSync(USER_DATA_PATH)) {
    const content = fs.readFileSync(USER_DATA_PATH, 'utf8');
    try {
        const users = JSON.parse(content);
        console.log(`Found ${users.length} users in JSON.`);
        const testUser = users.find(u => u.email === 'urdishasingh@gmail.com');
        if (testUser) {
            console.log('Target user found in JSON:', testUser.email);
            console.log('User has password field:', !!testUser.password);
        } else {
            console.log('Target user NOT found in JSON!');
        }
    } catch (e) {
        console.error('JSON Parse Error:', e.message);
    }
} else {
    console.log('JSON file does NOT exist.');
}

console.log('Checking MongoDB connection...');
const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
if (!mongoUrl) {
    console.error('MONGO URL MISSING');
} else {
    mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 3000 })
        .then(() => {
            console.log('MongoDB: Connected successfully.');
            process.exit(0);
        })
        .catch(err => {
            console.error('MongoDB: Connection FAILED:', err.message);
            process.exit(0);
        });
}

setTimeout(() => {
    console.log('Diagnostic timed out after 10s.');
    process.exit(0);
}, 10000);
