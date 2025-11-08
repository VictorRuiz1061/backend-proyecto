import { Module } from '@nestjs/common';
import { CategoriaElementoService } from './categoria_elemento.service';
import { CategoriaElementoController } from './categoria_elemento.controller';

@Module({
  controllers: [CategoriaElementoController],
  providers: [CategoriaElementoService],
})
export class CategoriaElementoModule {}
