import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateTipoSitioDto } from './dto/create-tipo_sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo_sitio.dto';
import { TipoSitio } from './entities/tipo_sitio.entity';

@Injectable()
export class TipoSitioService {
  constructor(
    @InjectRepository(TipoSitio)
    private readonly tipoSitioRepository: Repository<TipoSitio>,
  ) {}

  async create(createTipoSitioDto: CreateTipoSitioDto) {
    const tipoSitio = this.tipoSitioRepository.create(createTipoSitioDto);
    return await this.tipoSitioRepository.save(tipoSitio);
  }

  async findAll() {
    return await this.tipoSitioRepository.find({
      relations: ['sitios'],
    });
  }

  async findOne(id: number) {
    const tipoSitio = await this.tipoSitioRepository.findOne({
      where: { id_tipo_sitio: id },
      relations: ['sitios'],
    });

    if (!tipoSitio) {
      throw new NotFoundException(`Tipo de Sitio con ID ${id} no encontrado`);
    }

    return tipoSitio;
  }

  async search(term: string) {
    const tiposSitio = await this.tipoSitioRepository.find({
      where: { nombre_tipo_sitio: Like(`%${term}%`) },
      relations: ['sitios'],
    });

    if (!tiposSitio.length) {
      throw new NotFoundException(`No se encontraron tipos de sitio con el término de búsqueda "${term}"`);
    }

    return tiposSitio;
  }

  async update(id: number, updateTipoSitioDto: UpdateTipoSitioDto) {
    const tipoSitio = await this.findOne(id);
    Object.assign(tipoSitio, updateTipoSitioDto);
    return await this.tipoSitioRepository.save(tipoSitio);
  }

  async remove(id: number) {
    const tipoSitio = await this.findOne(id);
    return await this.tipoSitioRepository.remove(tipoSitio);
  }
}
