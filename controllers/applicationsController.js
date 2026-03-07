import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

const genAI = new GoogleGenerativeAI('AIzaSyDMsEm87cqb4BgEDmUIBiawV87_aPrshi8');

const sendEmail = async (to, subject, text) => {
    // Basic nodemailer setup - usually this would be in a separate utility
    // For now, logging to console if no SMTP provided, but setting up structure
    console.log(`Sending Email to: ${to}\nSubject: ${subject}\nText: ${text}`);

    // Placeholder for actual transport
    /*
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({ from: '"Job Tracker" <no-reply@jobtracker.com>', to, subject, text });
    */
};

const getAIFit = async (jobRequirements, userProfile) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
            Analyze the fit between a job seeker and a job opening.
            
            Job Requirements:
            ${jobRequirements}
            
            User Profile (Bio and Resume):
            ${userProfile}
            
            Based on this, provide:
            1. A fit score from 0 to 100.
            2. A brief feedback explaining why (max 2 sentences).
            
            Return ONLY a JSON object like this:
            { "score": 85, "feedback": "Your experience matches the technical requirements well, though you lack specific industry experience." }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Clean text in case of markdown blocks
        const jsonStr = text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('AI Fit Error:', error);
        return { score: 0, feedback: 'AI analysis unavailable at the moment.' };
    }
};

const applyToJob = async (req, res) => {
    const { jobId } = req.body;

    if (!jobId) {
        throw new BadRequestError('Please provide job ID');
    }

    const job = await Job.findOne({ _id: jobId });
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }

    if (!job.isPublic) {
        throw new BadRequestError('This job is not a public listing');
    }

    const alreadyApplied = await Application.findOne({
        job: jobId,
        user: req.user.userId,
    });

    if (alreadyApplied) {
        throw new BadRequestError('Already applied for this job');
    }

    const user = await User.findOne({ _id: req.user.userId });

    // AI Fit Analysis
    const profileText = `Bio: ${user.bio || 'N/A'}\nResume: ${user.resume || 'N/A'}`;
    const aiFit = await getAIFit(job.requirements || 'N/A', profileText);

    const application = await Application.create({
        job: jobId,
        user: req.user.userId,
        aiFitScore: aiFit.score,
        aiFeedback: aiFit.feedback,
    });

    // Send Email Notification
    await sendEmail(
        user.email,
        'Application Received',
        `Hi ${user.name},\n\nThank you for applying for the ${job.position} position at ${job.company}.\n\nOur AI has analyzed your fit score as ${aiFit.score}/100.\nFeedback: ${aiFit.feedback}\n\nYou will be contacted shortly.\n\nBest regards,\nThe ${job.company} Team`
    );

    res.status(StatusCodes.CREATED).json({ application });
};

const getJobApplications = async (req, res) => {
    // For HR: get all applications for jobs created by them
    const { jobId } = req.params;

    const job = await Job.findOne({ _id: jobId });
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }

    checkPermissions(req.user, job.createdBy);

    const applications = await Application.find({ job: jobId }).populate('user', 'name email lastName location');

    res.status(StatusCodes.OK).json({ applications, count: applications.length });
};

const getMyApplications = async (req, res) => {
    // For Seeker: get all their applications
    const applications = await Application.find({ user: req.user.userId }).populate('job');

    res.status(StatusCodes.OK).json({ applications, count: applications.length });
};

const updateApplicationStatus = async (req, res) => {
    const { id: applicationId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new BadRequestError('Please provide status');
    }

    const application = await Application.findOne({ _id: applicationId }).populate('job');
    if (!application) {
        throw new NotFoundError(`No application with id: ${applicationId}`);
    }

    checkPermissions(req.user, application.job.createdBy);

    application.status = status;
    await application.save();

    res.status(StatusCodes.OK).json({ application });
};

export {
    applyToJob,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
};
