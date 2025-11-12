import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMaterialService } from './tipo_material.service';
import { TipoMaterialController } from './tipo_material.controller';
import { TipoMaterial } from './entities/tipo_material.entity';
import { MaterialesModule } from '../materiales/materiales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoMaterial]),
    forwardRef(() => MaterialesModule),
  ],
  controllers: [TipoMaterialController],
  providers: [TipoMaterialService],
  exports: [TipoMaterialService],
})
export class TipoMaterialModule {}
