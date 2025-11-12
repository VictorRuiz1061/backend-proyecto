import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCategoriaElementoDto } from './dto/create-categoria_elemento.dto';
import { UpdateCategoriaElementoDto } from './dto/update-categoria_elemento.dto';
import { CategoriaElemento } from './entities/categoria_elemento.entity';

@Injectable()
export class CategoriaElementoService {
  constructor(
    @InjectRepository(CategoriaElemento)
    private readonly categoriaElementoRepository: Repository<CategoriaElemento>,
  ) {}

  async create(createCategoriaElementoDto: CreateCategoriaElementoDto) {
    const categoriaElemento = this.categoriaElementoRepository.create(createCategoriaElementoDto);
    return await this.categoriaElementoRepository.save(categoriaElemento);
  }

  async findAll() {
    return await this.categoriaElementoRepository.find({
      relations: ['materiales'],
    });
  }

  async findOne(id: number) {
    const categoriaElemento = await this.categoriaElementoRepository.findOne({
      where: { id_categoria_elemento: id },
      relations: ['materiales'],
    });

    if (!categoriaElemento) {
      throw new NotFoundException(`Categoría de Elemento con ID ${id} no encontrada`);
    }

    return categoriaElemento;
  }

  async search(term: string) {
    const categoriasElemento = await this.categoriaElementoRepository.find({
      where: [
        { codigo_unpsc: Like(`%${term}%`) },
        { nombre_categoria: Like(`%${term}%`) },
      ],
      relations: ['materiales'],
    });

    if (!categoriasElemento.length) {
      throw new NotFoundException(`No se encontraron categorías de elemento con el término de búsqueda "${term}"`);
    }

    return categoriasElemento;
  }

  async update(id: number, updateCategoriaElementoDto: UpdateCategoriaElementoDto) {
    const categoriaElemento = await this.findOne(id);
    Object.assign(categoriaElemento, updateCategoriaElementoDto);
    return await this.categoriaElementoRepository.save(categoriaElemento);
  }

  async remove(id: number) {
    const categoriaElemento = await this.findOne(id);
    return await this.categoriaElementoRepository.remove(categoriaElemento);
  }
}
