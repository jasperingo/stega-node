import express from 'express';
import multer from 'multer';
import stegano from 'nestyle-steganography';
import path from 'path';
import pdf from 'phantom-html-to-pdf';
import { promisify } from 'util';

const upload = multer({ storage: multer.memoryStorage() });

export const hodRoute = express.Router();

hodRoute.get('/hod', (req, res) => {
  res.render('hod',  { hodPage: true, homePage: false });
});

hodRoute.post('/hod', upload.single('image'), async (req, res) => {
  if (!req.body.key|| ! req.file) {
    return res.render('error', { message: 'Error: Image and secret key fields are compulsory.' });
  }

  if (process.env.SECRET_KEY !== req.body.key) {
    return res.render('error', { message: 'Error: Secret key is incorrect.' });
  }

  const ext = path.extname(req.file?.originalname ?? '');

  const html = stegano.decode(req.file.buffer, ext.substring(1), process.env.SECRET_KEY);

  const file = await promisify(pdf())({ html });

  res.contentType('application/pdf');

  res.attachment('stego-node-pdf.pdf');

  file.stream.pipe(res);
});
