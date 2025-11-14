import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    try {
      const area = this.areaRepository.create(createAreaDto);
      return await this.areaRepository.save(area);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El área con el nombre '${createAreaDto.nombre_area}' ya existe.`);
      }
      throw error;
    }
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

  async search(term: string) {
    const areas = await this.areaRepository.find({
      where: { nombre_area: term },
      relations: ['programas'],
    });

    if (!areas.length) {
      throw new NotFoundException(`No se encontraron áreas con el término de búsqueda "${term}"`);
    }

    return areas;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.findOne(id);
    Object.assign(area, updateAreaDto);
    try {
      return await this.areaRepository.save(area);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El área con el nombre '${updateAreaDto.nombre_area}' ya existe.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const area = await this.findOne(id);
    try {
      await this.areaRepository.remove(area);
      return { message: `El área con ID ${id} ha sido eliminada` };
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('Esta área no se puede eliminar porque está asignada a uno o más programas.');
      }
      throw error;
    }
  }
}
