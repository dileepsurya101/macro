import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { File } from '../models/File.js';

export async function getOrCreateConversation(conversationId) {
  if (conversationId) {
    const conv = await Conversation.findById(conversationId);
    if (conv) return conv;
  }
  // Create a new conversation (title set later from first message)
  return Conversation.create({});
}

export async function getRecentMessages(conversationId, limit = 20) {
  return Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .then((arr) => arr.reverse());
}

export async function getFilesByIds(fileIds) {
  if (!fileIds || !fileIds.length) return [];
  return File.find({ _id: { $in: fileIds } }).lean();
}
