import { Injectable } from '@nestjs/common';
import { CreateTipoSitioDto } from './dto/create-tipo_sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo_sitio.dto';

@Injectable()
export class TipoSitioService {
  create(createTipoSitioDto: CreateTipoSitioDto) {
    return 'This action adds a new tipoSitio';
  }

  findAll() {
    return `This action returns all tipoSitio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoSitio`;
  }

  update(id: number, updateTipoSitioDto: UpdateTipoSitioDto) {
    return `This action updates a #${id} tipoSitio`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoSitio`;
  }
}
