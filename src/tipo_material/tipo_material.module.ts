import { Module } from '@nestjs/common';
import { TipoMaterialService } from './tipo_material.service';
import { TipoMaterialController } from './tipo_material.controller';

@Module({
  controllers: [TipoMaterialController],
  providers: [TipoMaterialService],
})
export class TipoMaterialModule {}
