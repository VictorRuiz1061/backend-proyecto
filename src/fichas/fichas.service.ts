import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';
import { Ficha } from './entities/ficha.entity';
import { Programa } from '../programas/entities/programa.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class FichasService {
  constructor(
    @InjectRepository(Ficha)
    private readonly fichaRepository: Repository<Ficha>,
    @InjectRepository(Programa)
    private readonly programaRepository: Repository<Programa>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createFichaDto: CreateFichaDto): Promise<Ficha> {
    const { programa_id, usuario_id, ...fichaData } = createFichaDto;

    const programa = await this.programaRepository.findOne({ where: { id_programa: programa_id } });
    if (!programa) {
      throw new NotFoundException(`Programa con ID ${programa_id} no encontrado`);
    }

    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: usuario_id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuario_id} no encontrado`);
    }

    const ficha = this.fichaRepository.create({
      ...fichaData,
      programa,
      usuario,
    });

    try {
      return await this.fichaRepository.save(ficha);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`La ficha con el ID '${createFichaDto.id_ficha}' ya existe.`);
      }
      throw error;
    }
  }

  async findAll(): Promise<Ficha[]> {
    return await this.fichaRepository.find({ relations: ['programa', 'usuario'] });
  }

  async findOne(id: number): Promise<Ficha> {
    const ficha = await this.fichaRepository.findOne({
      where: { id_ficha: id },
      relations: ['programa', 'usuario'],
    });
    if (!ficha) {
      throw new NotFoundException(`Ficha con ID ${id} no encontrada`);
    }
    return ficha;
  }

  async update(id: number, updateFichaDto: UpdateFichaDto): Promise<Ficha> {
    const { programa_id, usuario_id, ...fichaData } = updateFichaDto;
    const ficha = await this.findOne(id);

    if (programa_id) {
      const programa = await this.programaRepository.findOne({ where: { id_programa: programa_id } });
      if (!programa) {
        throw new NotFoundException(`Programa con ID ${programa_id} no encontrado`);
      }
      ficha.programa = programa;
    }

    if (usuario_id) {
      const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: usuario_id } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${usuario_id} no encontrado`);
      }
      ficha.usuario = usuario;
    }

    Object.assign(ficha, fichaData);
    return await this.fichaRepository.save(ficha);
  }

  async remove(id: number): Promise<void> {
    const ficha = await this.findOne(id);
    await this.fichaRepository.remove(ficha);
  }
}
