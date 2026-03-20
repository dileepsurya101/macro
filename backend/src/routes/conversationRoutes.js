import { Router } from 'express';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { File } from '../models/File.js';

const router = Router();

// GET /api/conversations - list all conversations
router.get('/', async (req, res, next) => {
  try {
    const conversations = await Conversation.find({})
      .sort({ updatedAt: -1 })
      .select('title updatedAt')
      .lean();
    res.json({ conversations });
  } catch (err) {
    next(err);
  }
});

// GET /api/conversations/:id - get one conversation with messages and files
router.get('/:id', async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id).lean();
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    const files = await File.find({ conversationId: conversation._id })
      .select('originalName mimeType size createdAt')
      .lean();

    res.json({ conversation, messages, files });
  } catch (err) {
    next(err);
  }
});

export default router;
