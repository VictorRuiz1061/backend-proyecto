import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    try {
      const tipoSitio = this.tipoSitioRepository.create(createTipoSitioDto);
      return await this.tipoSitioRepository.save(tipoSitio);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El tipo de sitio '${createTipoSitioDto.nombre_tipo_sitio}' ya existe.`);
      }
      throw error;
    }
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
    try {
      return await this.tipoSitioRepository.save(tipoSitio);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El tipo de sitio '${updateTipoSitioDto.nombre_tipo_sitio}' ya existe.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const tipoSitio = await this.findOne(id);
    try {
      await this.tipoSitioRepository.remove(tipoSitio);
      return { message: `El tipo de sitio con ID ${id} ha sido eliminado` };
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('Este tipo de sitio no se puede eliminar porque está asignado a uno o más sitios.');
      }
      throw error;
    }
  }
}
