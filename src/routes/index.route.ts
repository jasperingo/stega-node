import express from 'express';
import multer from 'multer';
import stegano from 'nestyle-steganography';
import path from 'path';

const upload = multer({ storage: multer.memoryStorage() })

export const indexRoute = express.Router();

indexRoute.get('/', (req, res) => {
  res.render('index', { homePage: true, hodPage: false });
});

indexRoute.post('/', upload.single('image'), (req, res) => {

  if (!req.body.message || ! req.file) {
    return res.render('error', { message: 'Error: Image and message fields are compulsory.' });
  }

  const ext = path.extname(req.file?.originalname ?? '');

  const buffer: Buffer = stegano.write(req.file?.buffer, req.body.message, process.env.SECRET_KEY);

  res.attachment(`stego-node-image${ext}`);

  res.contentType(req.file?.mimetype ?? 'image/png');

  res.send(buffer);
});
