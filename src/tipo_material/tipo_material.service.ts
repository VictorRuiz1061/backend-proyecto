import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateTipoMaterialeDto } from './dto/create-tipo_material.dto';
import { UpdateTipoMaterialDto } from './dto/update-tipo_material.dto';
import { TipoMaterial } from './entities/tipo_material.entity';

@Injectable()
export class TipoMaterialService {
  constructor(
    @InjectRepository(TipoMaterial)
    private readonly tipoMaterialRepository: Repository<TipoMaterial>,
  ) {}

  async create(createTipoMaterialDto: CreateTipoMaterialeDto) {
    const tipoMaterial = this.tipoMaterialRepository.create(createTipoMaterialDto);
    return await this.tipoMaterialRepository.save(tipoMaterial);
  }

  async findAll() {
    return await this.tipoMaterialRepository.find({
      relations: ['materiales'],
    });
  }

  async findOne(id: number) {
    const tipoMaterial = await this.tipoMaterialRepository.findOne({
      where: { id_tipo_material: id },
      relations: ['materiales'],
    });

    if (!tipoMaterial) {
      throw new NotFoundException(`Tipo de Material con ID ${id} no encontrado`);
    }

    return tipoMaterial;
  }

  async search(term: string) {
    const tiposMaterial = await this.tipoMaterialRepository.find({
      where: { tipo_elemento: Like(`%${term}%`) },
      relations: ['materiales'],
    });

    if (!tiposMaterial.length) {
      throw new NotFoundException(`No se encontraron tipos de material con el término de búsqueda "${term}"`);
    }

    return tiposMaterial;
  }

  async update(id: number, updateTipoMaterialDto: UpdateTipoMaterialDto) {
    const tipoMaterial = await this.findOne(id);
    Object.assign(tipoMaterial, updateTipoMaterialDto);
    return await this.tipoMaterialRepository.save(tipoMaterial);
  }

  async remove(id: number) {
    const tipoMaterial = await this.findOne(id);
    return await this.tipoMaterialRepository.remove(tipoMaterial);
  }
}
