import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSitioService } from './tipo_sitio.service';
import { TipoSitioController } from './tipo_sitio.controller';
import { TipoSitio } from './entities/tipo_sitio.entity';
import { SitioModule } from '../sitios/sitio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoSitio]),
    forwardRef(() => SitioModule),
  ],
  controllers: [TipoSitioController],
  providers: [TipoSitioService],
  exports: [TipoSitioService],
})
export class TipoSitioModule {}
