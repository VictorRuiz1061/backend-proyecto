import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';
import { Sitio } from './entities/sitio.entity';

@Injectable()
export class SitioService {
  constructor(
    @InjectRepository(Sitio)
    private readonly sitioRepository: Repository<Sitio>,
  ) {}

  async create(createSitioDto: CreateSitioDto) {
    const sitio = this.sitioRepository.create({
      ...createSitioDto,
      tipo_sitio_id: { id_tipo_sitio: createSitioDto.tipo_sitio_id },
    });
    return await this.sitioRepository.save(sitio);
  }

  async findAll() {
    return await this.sitioRepository.find({
      relations: ['movimientos', 'tipo_sitio_id', 'inventarios'],
    });
  }

  async findOne(id: number) {
    const sitio = await this.sitioRepository.findOne({
      where: { id_sitio: id },
      relations: ['movimientos', 'tipo_sitio_id', 'inventarios'],
    });

    if (!sitio) {
      throw new NotFoundException(`Sitio con ID ${id} no encontrado`);
    }

    return sitio;
  }

  async search(term: string) {
    const sitios = await this.sitioRepository.find({
      where: [
        { nombre_sitio: Like(`%${term}%`) },
        { ubicacion: Like(`%${term}%`) },
      ],
      relations: ['movimientos', 'tipo_sitio_id', 'inventarios'],
    });

    if (!sitios.length) {
      throw new NotFoundException(`No se encontraron sitios con el término de búsqueda "${term}"`);
    }

    return sitios;
  }

  async update(id: number, updateSitioDto: UpdateSitioDto) {
    const sitio = await this.findOne(id);
    Object.assign(sitio, updateSitioDto);
    return await this.sitioRepository.save(sitio);
  }

  async remove(id: number) {
    const sitio = await this.findOne(id);
    return await this.sitioRepository.remove(sitio);
  }
}
