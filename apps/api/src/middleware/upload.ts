/**
 * File upload middleware (multer).
 *
 * Files are held in memory as buffers (we forward them straight to Cloudinary,
 * so we never write to local disk). We restrict uploads to images and cap the
 * size at 5 MB — basic input validation / abuse prevention (NFR-1).
 */
import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});
