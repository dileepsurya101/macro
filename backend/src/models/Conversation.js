import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'New conversation' },
    userId: { type: String, default: null },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', ConversationSchema);
