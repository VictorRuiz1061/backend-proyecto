import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    const area = this.areaRepository.create(createAreaDto);
    return await this.areaRepository.save(area);
  }

  async findAll() {
    return await this.areaRepository.find({
      relations: ['programas'], // solo relaciones válidas
    });
  }

  async findOne(id: number) {
    const area = await this.areaRepository.findOne({
      where: { id_area: id },
      relations: ['programas'],
    });

    if (!area) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.findOne(id);
    Object.assign(area, updateAreaDto);
    return await this.areaRepository.save(area);
  }

  async remove(id: number) {
    const area = await this.findOne(id);
    return await this.areaRepository.remove(area);
  }
}
