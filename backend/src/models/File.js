import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    originalName: String,
    mimeType: String,
    size: Number,
    storagePath: String,
    // Extracted plain text used as AI context
    extractedText: String,
  },
  { timestamps: true }
);

export const File = mongoose.model('File', FileSchema);
