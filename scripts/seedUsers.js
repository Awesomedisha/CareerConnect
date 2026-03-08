import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../db/connect.js';
import { saveUser } from '../utils/userStorage.js';

const users = [
    { name: 'Disha Singh', email: 'urdishasingh@gmail.com', password: 'Disha123', role: 'hr' },
    { name: 'Jagjeet Singh', email: 'urjagjeetsingh@gmail.com', password: 'H1a2r3t9@', role: 'hr' },
    { name: 'Test Seeker 1', email: 'test1@example.com', password: 'password123', role: 'seeker' },
    { name: 'Test HR 2', email: 'test2@example.com', password: 'password123', role: 'hr' },
    { name: 'Test Seeker 3', email: 'test3@example.com', password: 'password123', role: 'seeker' },
    { name: 'Test HR 4', email: 'test4@example.com', password: 'password123', role: 'hr' },
    { name: 'Test Seeker 5', email: 'test5@example.com', password: 'password123', role: 'seeker' },
    { name: 'Test HR 6', email: 'test6@example.com', password: 'password123', role: 'hr' },
    { name: 'Test Seeker 7', email: 'test7@example.com', password: 'password123', role: 'seeker' },
    { name: 'Test HR 8', email: 'test8@example.com', password: 'password123', role: 'hr' },
];

const seed = async () => {
    try {
        await connectDB(process.env.MONGO_URL || process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');

        for (const userData of users) {
            try {
                const user = await saveUser(userData);
                console.log(`Successfully seeded: ${userData.email}`);
            } catch (e) {
                console.warn(`Skipped or Failed ${userData.email}: ${e.message}`);
            }
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seed();
