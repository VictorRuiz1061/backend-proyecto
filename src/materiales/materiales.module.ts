import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialesService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { Material } from './entities/materiale.entity';
import { MovimientoModule } from '../movimientos/movimiento.module';
import { CaracteristicasModule } from '../caracteristicas/caracteristicas.module';
import { TipoMaterialModule } from '../tipo_material/tipo_material.module';
import { CategoriaElementoModule } from '../categoria_elemento/categoria_elemento.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Material]),
    forwardRef(() => MovimientoModule),
    forwardRef(() => CaracteristicasModule),
    forwardRef(() => TipoMaterialModule),
    forwardRef(() => CategoriaElementoModule),
  ],
  controllers: [MaterialesController],
  providers: [MaterialesService],
  exports: [MaterialesService],
})
export class MaterialesModule {}
