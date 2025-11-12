import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMovimientoService } from './tipo_movimiento.service';
import { TipoMovimientoController } from './tipo_movimiento.controller';
import { TipoMovimiento } from './entities/tipo_movimiento.entity';
import { MovimientoModule } from '../movimientos/movimiento.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoMovimiento]),
    forwardRef(() => MovimientoModule),
  ],
  controllers: [TipoMovimientoController],
  providers: [TipoMovimientoService],
  exports: [TipoMovimientoService],
})
export class TipoMovimientoModule {}
