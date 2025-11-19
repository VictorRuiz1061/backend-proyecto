import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private basePath = path.join(process.cwd(), 'public'); // usa /public

  async saveImage(file: Express.Multer.File, folder: string): Promise<string> {
    const dir = path.join(this.basePath, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const fullPath = path.join(dir, safeName);

    // file.buffer porque usamos memoryStorage
    fs.writeFileSync(fullPath, file.buffer);

    // guardamos ruta relativa (sin leading slash para guardarla en DB)
    return `${folder}/${safeName}`;
  }

  async deleteImage(relativePath: string): Promise<void> {
    if (!relativePath) return;
    const fullPath = path.join(this.basePath, relativePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
}
