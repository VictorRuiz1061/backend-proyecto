// src/seeders/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Rol } from '../roles/entities/role.entity';
import { Modulo } from '../modulos/entities/modulo.entity';
import { Permiso } from '../permisos/entities/permiso.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule, // ✅ permite usar .env en el seeder
    TypeOrmModule.forFeature([
      Usuario,
      Rol,
      Modulo,
      Permiso, // ✅ incluir estas dos entidades nuevas
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
