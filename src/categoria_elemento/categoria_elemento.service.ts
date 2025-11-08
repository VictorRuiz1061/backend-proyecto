import { Injectable } from '@nestjs/common';
import { CreateCategoriaElementoDto } from './dto/create-categoria_elemento.dto';
import { UpdateCategoriaElementoDto } from './dto/update-categoria_elemento.dto';

@Injectable()
export class CategoriaElementoService {
  create(createCategoriaElementoDto: CreateCategoriaElementoDto) {
    return 'This action adds a new categoriaElemento';
  }

  findAll() {
    return `This action returns all categoriaElemento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriaElemento`;
  }

  update(id: number, updateCategoriaElementoDto: UpdateCategoriaElementoDto) {
    return `This action updates a #${id} categoriaElemento`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriaElemento`;
  }
}
