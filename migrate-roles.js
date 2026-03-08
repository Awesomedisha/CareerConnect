import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to DB');
        const result = await mongoose.connection.db.collection('users').updateMany(
            { role: { $exists: false } },
            { $set: { role: 'seeker' } }
        );
        console.log(`Updated ${result.modifiedCount} users`);
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrate();
