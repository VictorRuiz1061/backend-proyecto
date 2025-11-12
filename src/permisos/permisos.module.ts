import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { Permiso } from './entities/permiso.entity';
import { RolesModule } from '../roles/roles.module';
import { ModulosModule } from '../modulos/modulos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permiso]),
    forwardRef(() => RolesModule),
    forwardRef(() => ModulosModule),
  ],
  controllers: [PermisosController],
  providers: [PermisosService],
  exports: [PermisosService],
})
export class PermisosModule {}
