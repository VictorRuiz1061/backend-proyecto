import { Module } from '@nestjs/common';
import { SitioService } from './sitio.service';
import { SitioController } from './sitio.controller';

@Module({
  controllers: [SitioController],
  providers: [SitioService],
})
export class SitioModule {}
