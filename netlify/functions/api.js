import serverless from 'serverless-http';
import app from '../../server.js';

export const handler = serverless(app);

// Netlify function config - use esbuild for ESM support
export const config = {
    generator: '@netlify/functions-utils',
};
