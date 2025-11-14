import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Programa } from './entities/programa.entity';
import { Area } from '../areas/entities/area.entity';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa)
    private readonly programaRepository: Repository<Programa>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async create(createProgramaDto: CreateProgramaDto) {
    const { area_id, ...programaData } = createProgramaDto;

    const area = await this.areaRepository.findOne({ where: { id_area: area_id } });
    if (!area) {
      throw new NotFoundException(`Área con ID ${area_id} no encontrada`);
    }

    const programa = this.programaRepository.create({
      ...programaData,
      area,
    });

    try {
      return await this.programaRepository.save(programa);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El programa con el nombre '${createProgramaDto.nombre_programa}' ya existe.`);
      }
      throw error;
    }
  }

  async findAll() {
    return await this.programaRepository.find({
      relations: ['area', 'fichas'],
    });
  }

  async findOne(id: number) {
    const programa = await this.programaRepository.findOne({
      where: { id_programa: id },
      relations: ['area', 'fichas'],
    });

    if (!programa) {
      throw new NotFoundException(`Programa con ID ${id} no encontrado`);
    }

    return programa;
  }

  async search(term: string) {
    const programas = await this.programaRepository.find({
      where: { nombre_programa: term },
      relations: ['area', 'fichas'],
    });

    if (!programas.length) {
      throw new NotFoundException(`No se encontraron programas con el término de búsqueda "${term}"`);
    }

    return programas;
  }

  async update(id: number, updateProgramaDto: UpdateProgramaDto) {
    const { area_id, ...programaData } = updateProgramaDto;
    const programa = await this.findOne(id);

    if (area_id) {
      const area = await this.areaRepository.findOne({ where: { id_area: area_id } });
      if (!area) {
        throw new NotFoundException(`Área con ID ${area_id} no encontrada`);
      }
      programa.area = area;
    }

    Object.assign(programa, programaData);
    try {
      return await this.programaRepository.save(programa);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El programa con el nombre '${updateProgramaDto.nombre_programa}' ya existe.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const programa = await this.findOne(id);
    try {
      await this.programaRepository.remove(programa);
      return { message: `El programa con ID ${id} ha sido eliminado` };
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('Este programa no se puede eliminar porque está asignado a una o más fichas.');
      }
      throw error;
    }
  }
}
