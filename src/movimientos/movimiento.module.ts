import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoService } from './movimiento.service';
import { MovimientoController } from './movimiento.controller';
import { Movimiento } from './entities/movimiento.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { TipoMovimientoModule } from '../tipo_movimiento/tipo_movimiento.module';
import { MaterialesModule } from '../materiales/materiales.module';
import { SitioModule } from '../sitios/sitio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movimiento]),
    forwardRef(() => UsuariosModule),
    forwardRef(() => TipoMovimientoModule),
    forwardRef(() => MaterialesModule),
    forwardRef(() => SitioModule),
  ],
  controllers: [MovimientoController],
  providers: [MovimientoService],
  exports: [MovimientoService],
})
export class MovimientoModule {}
