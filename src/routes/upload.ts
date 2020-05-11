import express from 'express';
import multer from 'multer';
import path from 'path';
import mkdirp from 'mkdirp';
import sharp from 'sharp';

import config from '../config';
import models from '../models';

const { DESTINATION = 'uploads' } = process.env;
const AVAILABLE_EXTENTIONS = ['.png', '.jpg', '.jpeg'];
const router = express.Router();
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const today = new Date();
    const dir = `/${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`;
    const fullDir = `${DESTINATION}${dir}`;

    req.body.dir = dir;

    await mkdirp(fullDir);

    cb(null, fullDir);
  },

  filename: async (req, file, cb) => {
    const { userId, dir } = req.body;
    const name = Date.now().toString(36);
    const ext = path.extname(file.originalname);
    const fileName = `${name}${ext}`;
    
    await models.User.findByIdAndUpdate( userId, {
      photo: `${dir}/${fileName}`,
    });

    cb(null, fileName);
  },
  // sharp: (req, file, cb) => {
  //   const resizer = sharp()
  //     .resize(1024, 768)
  //     .max()
  //     .withoutEnlargement()
  //     .toFormat('jpg')
  //     .jpeg({
  //       quality: 40,
  //       progressive: true
  //     });

  //   cb(null, resizer);
  // },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (AVAILABLE_EXTENTIONS.includes(ext)) {
      cb(null, true);
      return;
    }

    const err = new Error(
      `You can upload files with ${AVAILABLE_EXTENTIONS.join(', ')} extention!`,
    );

    cb(err);
  }
}).single('file');

router.post('/image', (req, res) => {
  upload(req, res, (err) => {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(401).json({
        error: 'Max photo size is 2mb!',
      });
    }

    if (err && err.code === 'EXTENTION') {
      return res.status(401).json({
        error: err.message,
      });
    }

    res.status(200).json('success');
  });
});

export default router;
