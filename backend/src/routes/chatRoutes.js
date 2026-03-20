import { Router } from 'express';
import { getChatCompletion } from '../services/aiService.js';
import { webSearch } from '../services/webSearchService.js';
import { buildPrompt } from '../utils/promptBuilder.js';
import {
  getOrCreateConversation,
  getRecentMessages,
  getFilesByIds,
} from '../services/conversationService.js';
import { Message } from '../models/Message.js';

const router = Router();

// POST /api/chat
router.post('/', async (req, res, next) => {
  try {
    const { conversationId, message, fileIds = [], useWebSearch = false } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Get or create conversation
    const conv = await getOrCreateConversation(conversationId);

    // Load recent messages and file texts for context
    const recent = await getRecentMessages(conv._id);
    const files = await getFilesByIds(fileIds);
    const fileTexts = files.map((f) => f.extractedText).filter(Boolean);

    // Optional web search
    let webSearchSummary = '';
    if (useWebSearch) {
      webSearchSummary = await webSearch(message);
    }

    // Save user message
    const userMsg = await Message.create({
      conversationId: conv._id,
      role: 'user',
      content: message.trim(),
      useWebSearch,
      fileIds,
    });

    // Build prompt and call AI
    const promptMessages = buildPrompt({
      messages: [...recent, userMsg],
      fileTexts,
      webSearchSummary,
    });

    const reply = await getChatCompletion(promptMessages);

    // Save assistant message
    const assistantMsg = await Message.create({
      conversationId: conv._id,
      role: 'assistant',
      content: reply,
    });

    res.json({
      conversationId: conv._id,
      reply,
      messages: [userMsg, assistantMsg],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
