import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Parse JSON bodies (limit 1 MB)
app.use(express.json({ limit: '1mb' }));

// CORS: allow only the configured client origin
app.use(
  cors({
    origin: env.clientOrigin || '*',
    credentials: true,
  })
);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/conversations', conversationRoutes);

// Global error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB then start listening
connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Macro backend listening on http://localhost:${env.port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
