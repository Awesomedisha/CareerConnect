import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

import 'express-async-errors';
import morgan from 'morgan';

// Database and Authentication
import connectDB from './db/connect.js';
import mongoose from 'mongoose';

// Routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';
import applicationsRouter from './routes/applicationsRoutes.js';

// Middleware
import { notFoundMiddleware } from './middleware/not-found.js';
import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { authenticateUser } from './middleware/authenticate.js';

// Deployment
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Security Packages
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 4000;
const PROJECT_ROOT = dirname(fileURLToPath(import.meta.url));
const isServerless =
  !!process.env.NETLIFY ||
  !!process.env.VERCEL ||
  !!process.env.LAMBDA_TASK_ROOT;

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── DB Connection for Serverless (MUST come BEFORE routes) ──────────────────
let dbConnected = false;
if (isServerless) {
  app.use(async (req, res, next) => {
    if (!dbConnected) {
      const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
      if (!mongoUrl) {
        console.error('CRITICAL: MONGO_URL/MONGO_URI env var is missing!');
        return res.status(500).json({ msg: 'Database URL not configured. Please set MONGO_URL in Netlify environment variables.' });
      }
      try {
        console.log('Serverless: Connecting to MongoDB...');
        await connectDB(mongoUrl);
        dbConnected = true;
        console.log('Serverless: MongoDB connected.');
      } catch (err) {
        console.error('Serverless: MongoDB connection failed:', err.message);
        return res.status(500).json({ msg: 'Database connection failed. If on Netlify, whitelist 0.0.0.0/0 in MongoDB Atlas.' });
      }
    }
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/v1', (req, res) => {
  res.json({ status: 'ok', msg: 'CareerConnect API is running' });
});

app.get('/api/v1/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    environment: isServerless ? 'serverless' : 'local',
    platform: process.env.NETLIFY ? 'Netlify' : (process.env.VERCEL ? 'Vercel' : 'Local'),
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use('/api/v1/applications', authenticateUser, applicationsRouter);

// ─── Static Files (Local only — Netlify/Vercel serve via CDN) ─────────────────
if (!isServerless) {
  const buildPath = path.resolve(PROJECT_ROOT, './client/build');
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(PROJECT_ROOT, './client/build', 'index.html'));
    });
  }
}

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// ─── Local Server Start ───────────────────────────────────────────────────────
const start = async () => {
  if (isServerless) return; // Serverless: no need to call app.listen()

  try {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!mongoUrl) throw new Error('MONGO_URL or MONGO_URI environment variable not found');

    console.log('Localhost: Connecting to MongoDB...');
    await connectDB(mongoUrl);
    console.log('Localhost: DB Connected.');
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error('CRITICAL: Server startup failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
};

start();

export default app;