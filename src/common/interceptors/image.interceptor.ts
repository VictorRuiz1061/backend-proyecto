import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ImageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const file: Express.Multer.File | undefined = req.file;

    // Si no hay archivo, dejamos pasar (la ruta puede no exigir imagen)
    if (!file) return next.handle();

    // Validaciones básicas
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen válida.');
    }

    const original = file.originalname ?? '';
    const ext = original.split('.').pop()?.toLowerCase();
    if (!ext) throw new BadRequestException('La imagen debe tener extensión.');

    const allowed = ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowed.includes(ext)) {
      throw new BadRequestException('Formato inválido. Solo JPG, PNG, WEBP.');
    }

    return next.handle();
  }
}
