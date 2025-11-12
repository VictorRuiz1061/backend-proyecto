import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaracteristicasService } from './caracteristicas.service';
import { CaracteristicasController } from './caracteristicas.controller';
import { Caracteristica } from './entities/caracteristica.entity';
import { MaterialesModule } from '../materiales/materiales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Caracteristica]),
    forwardRef(() => MaterialesModule),
  ],
  controllers: [CaracteristicasController],
  providers: [CaracteristicasService],
  exports: [CaracteristicasService],
})
export class CaracteristicasModule {}
