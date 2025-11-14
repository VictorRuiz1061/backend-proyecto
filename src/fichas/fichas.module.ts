import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichasService } from './fichas.service';
import { FichasController } from './fichas.controller';
import { Ficha } from './entities/ficha.entity';
import { ProgramasModule } from '../programas/programas.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { Programa } from '../programas/entities/programa.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ficha, Programa, Usuario]),
    forwardRef(() => ProgramasModule),
    forwardRef(() => UsuariosModule),
  ],
  controllers: [FichasController],
  providers: [FichasService],
  exports: [FichasService],
})
export class FichasModule {}
