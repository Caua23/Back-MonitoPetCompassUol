import * as multer from 'multer';
import * as path from 'path';
import { randomBytes } from 'crypto';
import * as multerS3 from 'multer-s3';
import { AUTO_CONTENT_TYPE } from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3'; 
import * as fs from 'fs';

const uploadFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}
function generateFileName(originalName: string, cb: (error: Error | null, filename?: string) => void) {
  randomBytes(16, (err, hash) => {
    if (err) return cb(err);
    const fileName = `${hash.toString('hex')}-${originalName}`;
    cb(null, fileName);
  });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    generateFileName(file.originalname, cb);
  },
});


const s3Client = new S3Client({
  region: 'sa-east-1', 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const s3Storage = multerS3({
  s3: s3Client, 
  bucket: process.env.BUCKET_NAME ?? '',
  contentType: AUTO_CONTENT_TYPE,
  // acl: 'public-read',
  key: (req, file, cb) => {
    generateFileName(file.originalname, cb);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type.'));
  }
};

export const multerConfig = {
  dest: uploadFolder,
  storage: process.env.STORAGE_TYPE === 's3' ? s3Storage : localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
};
