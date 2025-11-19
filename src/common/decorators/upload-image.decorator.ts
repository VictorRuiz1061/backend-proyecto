import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ImageInterceptor } from '../interceptors/image.interceptor';
import { extname } from 'path';

export function UploadImage(folder: string) {
  // Usamos memoryStorage y delegamos validación al ImageInterceptor
  const interceptor = FileInterceptor('imagen', {
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const name = file?.originalname ?? '';
      const ext = extname(name).toLowerCase().replace('.', '');
      const allowed = ['jpg', 'jpeg', 'png', 'webp'];
      if (!allowed.includes(ext)) {
        return cb(new Error('Formato inválido. Solo JPG, PNG, WEBP'));
      }
      cb(null, true);
    },
  });

  return applyDecorators(
    UseInterceptors(interceptor, new ImageInterceptor()),
  );
}
