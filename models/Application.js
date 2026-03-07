import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Types.ObjectId,
            ref: 'Job',
            required: [true, 'Please provide job'],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'accepted', 'rejected'],
            default: 'pending',
        },
        aiFitScore: {
            type: Number,
            default: 0,
        },
        aiFeedback: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Application', ApplicationSchema);
