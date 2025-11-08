import { Injectable } from '@nestjs/common';
import { CreateTipoMovimientoDto } from './dto/create-tipo_movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo_movimiento.dto';

@Injectable()
export class TipoMovimientoService {
  create(createTipoMovimientoDto: CreateTipoMovimientoDto) {
    return 'This action adds a new tipoMovimiento';
  }

  findAll() {
    return `This action returns all tipoMovimiento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoMovimiento`;
  }

  update(id: number, updateTipoMovimientoDto: UpdateTipoMovimientoDto) {
    return `This action updates a #${id} tipoMovimiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoMovimiento`;
  }
}
