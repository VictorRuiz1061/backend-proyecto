import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { FichasModule } from '../fichas/fichas.module';
import { RolesModule } from '../roles/roles.module';
import { MovimientoModule } from '../movimientos/movimiento.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    forwardRef(() => FichasModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MovimientoModule),
    ImageModule, // 👈 IMPORTANTE
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
