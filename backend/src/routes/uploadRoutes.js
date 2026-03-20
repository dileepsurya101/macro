import { Router } from 'express';
import multer from 'multer';
import { File } from '../models/File.js';
import { extractTextFromFile } from '../services/fileService.js';

const router = Router();

// Disk storage: files saved to backend/uploads/ in dev
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type. Allowed: PDF, DOCX, TXT'));
    }
    cb(null, true);
  },
});

// POST /api/upload
router.post('/', upload.array('files', 5), async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    const savedFiles = [];
    for (const file of req.files) {
      const extractedText = await extractTextFromFile(file);
      const doc = await File.create({
        conversationId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storagePath: file.path,
        extractedText,
      });
      savedFiles.push({
        id: doc._id,
        originalName: doc.originalName,
        mimeType: doc.mimeType,
        size: doc.size,
      });
    }

    res.json({ files: savedFiles });
  } catch (err) {
    next(err);
  }
});

export default router;
