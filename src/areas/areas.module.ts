import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { Area } from './entities/area.entity';
import { ProgramasModule } from '../programas/programas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area]),
    forwardRef(() => ProgramasModule),
  ],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService],
})
export class AreasModule {}
