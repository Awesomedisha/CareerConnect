import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

// express-async-errors 
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

// Cookie Parser
import cookieParser from 'cookie-parser';

const PROJECT_ROOT = dirname(fileURLToPath(import.meta.url));
const isServerless =
  process.env.VERCEL === '1' ||
  !!process.env.VERCEL ||
  !!process.env.NETLIFY ||
  !!process.env.LAMBDA_TASK_ROOT;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'production' || isServerless) {
  app.use(morgan('dev'));
}

// Routes
app.get('/api/v1', (req, res) => {
  res.send('Hello from CareerConnect API');
});

app.get('/api/v1/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

  // Dynamic imports to check types without crashing initialization if possible
  let authTypes = {};
  try {
    const auth = await import('./controllers/authController.js');
    authTypes = {
      register: typeof auth.register,
      login: typeof auth.login,
      updateUser: typeof auth.updateUser,
    };
  } catch (e) {
    authTypes = { error: e.message };
  }

  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    environment: isServerless ? 'serverless' : 'server',
    platform: process.env.NETLIFY ? 'Netlify' : (process.env.VERCEL ? 'Vercel' : 'Local'),
    diagnostics: {
      authController: authTypes,
      middleware: {
        authenticateUser: typeof authenticateUser,
        notFoundMiddleware: typeof notFoundMiddleware,
        errorHandlerMiddleware: typeof errorHandlerMiddleware
      }
    }
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use('/api/v1/applications', authenticateUser, applicationsRouter);

// Database Connection Middleware for Serverless
// This ensures the DB is connected before processing requests without calling app.listen()
let dbConnected = false;
if (isServerless) {
  app.use(async (req, res, next) => {
    if (!dbConnected) {
      const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
      if (!mongoUrl) {
        console.error('CRITICAL ERROR: MONGO_URL or MONGO_URI environment variable is missing for serverless function.');
        return res.status(500).json({ msg: 'Server configuration error: Database URL missing.' });
      }
      try {
        console.log('Serverless: Attempting to connect to MongoDB...');
        await connectDB(mongoUrl);
        dbConnected = true;
        console.log('Serverless: MongoDB connected successfully.');
      } catch (error) {
        console.error('Serverless: MongoDB connection failed:', error);
        return res.status(500).json({ msg: 'Database connection failed. Please check server logs.' });
      }
    }
    next();
  });
}

// Static Assets & Catch-all (Only when NOT on Serverless)
// Platforms like Vercel/Netlify handle static assets via CDN
if (!isServerless) {
  const buildPath = path.resolve(PROJECT_ROOT, './client/build');
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(PROJECT_ROOT, './client/build', 'index.html'));
    });
  }
}

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;

const start = async () => {
  try {
    // Only connect here if NOT in serverless middleware mode
    if (!isServerless) {
      if (!mongoUrl) {
        throw new Error('Please provide MONGO_URL or MONGO_URI in .env file');
      }
      await connectDB(mongoUrl);
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
      });
    }
  } catch (error) {
    console.error('Startup Error:', error);
  }
};

start();

export default app;