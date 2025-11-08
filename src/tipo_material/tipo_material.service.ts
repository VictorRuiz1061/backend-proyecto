import { Injectable } from '@nestjs/common';
import { CreateTipoMaterialDto } from './dto/create-tipo_material.dto';
import { UpdateTipoMaterialDto } from './dto/update-tipo_material.dto';

@Injectable()
export class TipoMaterialService {
  create(createTipoMaterialDto: CreateTipoMaterialDto) {
    return 'This action adds a new tipoMaterial';
  }

  findAll() {
    return `This action returns all tipoMaterial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoMaterial`;
  }

  update(id: number, updateTipoMaterialDto: UpdateTipoMaterialDto) {
    return `This action updates a #${id} tipoMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoMaterial`;
  }
}
