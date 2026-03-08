import { saveUser, findUserByEmail } from './utils/userStorage.js';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        console.log('Testing saveUser...');
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'seeker'
        };
        const user = await saveUser(userData);
        console.log('saveUser Result:', user ? 'MongoDB Success' : 'MongoDB Failed (JSON only or Error)');

        console.log('Testing findUserByEmail...');
        const found = await findUserByEmail('test@example.com');
        console.log('findUserByEmail Result:', found ? 'Found' : 'Not Found');

        process.exit(0);
    } catch (err) {
        console.error('Diagnostic Error:', err);
        process.exit(1);
    }
};

test();
