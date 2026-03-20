import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    useWebSearch: { type: Boolean, default: false },
    fileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', MessageSchema);
