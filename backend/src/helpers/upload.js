
import multer from 'multer';
import path from 'path';
import { imageFilter } from './images';
const upload = multer({
    storage,
    limits: {
      fileSize: 1000000, // 1000000 Bytes = 1 MB
    },
    fileFilter: imageFilter,
  }).single('image');