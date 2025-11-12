import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitioService } from './sitio.service';
import { SitioController } from './sitio.controller';
import { Sitio } from './entities/sitio.entity';
import { MovimientoModule } from '../movimientos/movimiento.module';
import { TipoSitioModule } from '../tipo_sitio/tipo_sitio.module';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sitio]),
    forwardRef(() => MovimientoModule),
    forwardRef(() => TipoSitioModule),
    forwardRef(() => InventarioModule),
  ],
  controllers: [SitioController],
  providers: [SitioService],
  exports: [SitioService],
})
export class SitioModule {}
