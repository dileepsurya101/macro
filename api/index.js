// Vercel Serverless Function entry point
// This file re-exports the Express app so Vercel can run it as a serverless function.
// All backend source code lives in ../backend/src/

import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

// Connect to MongoDB once (connection is cached across warm invocations)
let connected = false;
async function ensureDB() {
  if (!connected) {
    await connectDB();
    connected = true;
  }
}

export default async function handler(req, res) {
  await ensureDB();
  return app(req, res);
}
