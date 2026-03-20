// Express app factory - separated from server.js so it can be imported
// by both the local dev server (server.js) and Vercel serverless (api/index.js)
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: env.clientOrigin || '*',
    credentials: true,
  })
);

app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/conversations', conversationRoutes);

app.use(errorHandler);

export default app;
