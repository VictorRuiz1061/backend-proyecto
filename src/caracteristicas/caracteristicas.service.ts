import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCaracteristicaDto } from './dto/create-caracteristica.dto';
import { UpdateCaracteristicaDto } from './dto/update-caracteristica.dto';
import { Caracteristica } from './entities/caracteristica.entity';

@Injectable()
export class CaracteristicasService {
  constructor(
    @InjectRepository(Caracteristica)
    private readonly caracteristicaRepository: Repository<Caracteristica>,
  ) {}

  async create(createCaracteristicaDto: CreateCaracteristicaDto) {
    const caracteristica = this.caracteristicaRepository.create(createCaracteristicaDto);
    return await this.caracteristicaRepository.save(caracteristica);
  }

  async findAll() {
    return await this.caracteristicaRepository.find({
      relations: ['material'],
    });
  }

  async findOne(id: number) {
    const caracteristica = await this.caracteristicaRepository.findOne({
      where: { id_caracteristica: id },
      relations: ['material'],
    });

    if (!caracteristica) {
      throw new NotFoundException(`Característica con ID ${id} no encontrada`);
    }

    return caracteristica;
  }

  async search(term: string) {
    const caracteristicas = await this.caracteristicaRepository.find({
      relations: ['material'],
    });

    if (!caracteristicas.length) {
      throw new NotFoundException(`No se encontraron características con el término de búsqueda "${term}"`);
    }

    return caracteristicas;
  }

  async update(id: number, updateCaracteristicaDto: UpdateCaracteristicaDto) {
    const caracteristica = await this.findOne(id);
    Object.assign(caracteristica, updateCaracteristicaDto);
    return await this.caracteristicaRepository.save(caracteristica);
  }

  async remove(id: number) {
    const caracteristica = await this.findOne(id);
    return await this.caracteristicaRepository.remove(caracteristica);
  }
}
