import { Module } from '@nestjs/common';
import { TipoSitioService } from './tipo_sitio.service';
import { TipoSitioController } from './tipo_sitio.controller';

@Module({
  controllers: [TipoSitioController],
  providers: [TipoSitioService],
})
export class TipoSitioModule {}
