import { Injectable } from '@nestjs/common';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';

@Injectable()
export class SitioService {
  create(createSitioDto: CreateSitioDto) {
    return 'This action adds a new sitio';
  }

  findAll() {
    return `This action returns all sitio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sitio`;
  }

  update(id: number, updateSitioDto: UpdateSitioDto) {
    return `This action updates a #${id} sitio`;
  }

  remove(id: number) {
    return `This action removes a #${id} sitio`;
  }
}
