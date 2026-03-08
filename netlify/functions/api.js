import serverless from 'serverless-http';
import app from '../../server.js';

// Wrap Express app for Netlify serverless functions
export const handler = serverless(app);
