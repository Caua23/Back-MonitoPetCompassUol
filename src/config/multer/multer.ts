import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3'; 

const uploadFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

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
  region: 'us-west-1', 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const s3Storage = multerS3({
  s3: s3Client, 
  bucket: process.env.BUCKET_NAME ?? '',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  key: (req, file, cb) => {
    generateFileName(file.originalname, cb);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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
