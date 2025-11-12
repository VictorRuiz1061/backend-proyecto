import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Programa } from './entities/programa.entity';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa)
    private readonly programaRepository: Repository<Programa>,
  ) {}

  async create(createProgramaDto: CreateProgramaDto) {
    const programa = this.programaRepository.create(createProgramaDto);
    return await this.programaRepository.save(programa);
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
    const programa = await this.findOne(id);
    Object.assign(programa, updateProgramaDto);
    return await this.programaRepository.save(programa);
  }

  async remove(id: number) {
    const programa = await this.findOne(id);
    return await this.programaRepository.remove(programa);
  }
}
