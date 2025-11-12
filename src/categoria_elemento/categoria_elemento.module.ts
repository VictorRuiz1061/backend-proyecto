import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaElementoService } from './categoria_elemento.service';
import { CategoriaElementoController } from './categoria_elemento.controller';
import { CategoriaElemento } from './entities/categoria_elemento.entity';
import { MaterialesModule } from '../materiales/materiales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaElemento]),
    forwardRef(() => MaterialesModule),
  ],
  controllers: [CategoriaElementoController],
  providers: [CategoriaElementoService],
  exports: [CategoriaElementoService],
})
export class CategoriaElementoModule {}
