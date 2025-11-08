import { Module } from '@nestjs/common';
import { TipoMovimientoService } from './tipo_movimiento.service';
import { TipoMovimientoController } from './tipo_movimiento.controller';

@Module({
  controllers: [TipoMovimientoController],
  providers: [TipoMovimientoService],
})
export class TipoMovimientoModule {}
