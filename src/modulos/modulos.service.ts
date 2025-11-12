import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { Modulo } from './entities/modulo.entity';

@Injectable()
export class ModulosService {
  constructor(
    @InjectRepository(Modulo)
    private readonly moduloRepository: Repository<Modulo>,
  ) {}

  async create(createModuloDto: CreateModuloDto) {
    const modulo = this.moduloRepository.create(createModuloDto);
    return await this.moduloRepository.save(modulo);
  }

  async findAll() {
    return await this.moduloRepository.find({
      relations: ['modulo_padre', 'submodulos'],
    });
  }

  async findOne(id: number) {
    const modulo = await this.moduloRepository.findOne({
      where: { id_modulo: id },
      relations: ['modulo_padre', 'submodulos'],
    });

    if (!modulo) {
      throw new NotFoundException(`Módulo con ID ${id} no encontrado`);
    }

    return modulo;
  }

  async search(term: string) {
    const modulos = await this.moduloRepository.find({
      where: [
        { rutas: Like(`%${term}%`) },
        { descripcion_ruta: Like(`%${term}%`) },
        { mensaje_cambio: Like(`%${term}%`) },
      ],
      relations: ['modulo_padre', 'submodulos'],
    });

    if (!modulos.length) {
      throw new NotFoundException(`No se encontraron módulos con el término de búsqueda "${term}"`);
    }

    return modulos;
  }

  async update(id: number, updateModuloDto: UpdateModuloDto) {
    const modulo = await this.findOne(id);
    Object.assign(modulo, updateModuloDto);
    return await this.moduloRepository.save(modulo);
  }

  async remove(id: number) {
    const modulo = await this.findOne(id);
    return await this.moduloRepository.remove(modulo);
  }
}
