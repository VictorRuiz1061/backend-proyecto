import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramasService } from './programas.service';
import { ProgramasController } from './programas.controller';
import { Programa } from './entities/programa.entity';
import { AreasModule } from '../areas/areas.module';
import { FichasModule } from '../fichas/fichas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Programa]),
    forwardRef(() => AreasModule),
    forwardRef(() => FichasModule),
  ],
  controllers: [ProgramasController],
  providers: [ProgramasService],
  exports: [ProgramasService],
})
export class ProgramasModule {}
