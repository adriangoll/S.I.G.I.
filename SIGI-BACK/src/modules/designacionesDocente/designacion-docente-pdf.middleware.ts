import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const MABS_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'mabs');

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const mabId = String(req.params.id || '').trim();
    if (!/^\d+$/.test(mabId)) {
      cb(new Error('El id del MAB es invalido.'), '');
      return;
    }

    const folderPath = path.join(MABS_UPLOAD_DIR, mabId);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.pdf';
    const unique = `${Date.now()}-${crypto.randomUUID()}`;
    cb(null, `${unique}${ext}`);
  },
});

export const mabPdfMiddleware = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
      return;
    }

    cb(new Error('Solo se permiten archivos PDF.'));
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
