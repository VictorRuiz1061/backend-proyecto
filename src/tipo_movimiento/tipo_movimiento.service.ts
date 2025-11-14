import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateTiposMovimientoDto } from './dto/create-tipo_movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo_movimiento.dto';
import { TipoMovimiento } from './entities/tipo_movimiento.entity';

@Injectable()
export class TipoMovimientoService {
  constructor(
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepository: Repository<TipoMovimiento>,
  ) {}

  async create(createTipoMovimientoDto: CreateTiposMovimientoDto) {
    try {
      const tipoMovimiento = this.tipoMovimientoRepository.create(createTipoMovimientoDto);
      return await this.tipoMovimientoRepository.save(tipoMovimiento);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El tipo de movimiento '${createTipoMovimientoDto.tipo_movimiento}' ya existe.`);
      }
      throw error;
    }
  }

  async findAll() {
    return await this.tipoMovimientoRepository.find({
      relations: ['movimientos'],
    });
  }

  async findOne(id: number) {
    const tipoMovimiento = await this.tipoMovimientoRepository.findOne({
      where: { id_tipo_movimiento: id },
      relations: ['movimientos'],
    });

    if (!tipoMovimiento) {
      throw new NotFoundException(`Tipo de Movimiento con ID ${id} no encontrado`);
    }

    return tipoMovimiento;
  }

  async search(term: string) {
    const tiposMovimiento = await this.tipoMovimientoRepository.find({
      where: { tipo_movimiento: Like(`%${term}%`) },
      relations: ['movimientos'],
    });

    if (!tiposMovimiento.length) {
      throw new NotFoundException(`No se encontraron tipos de movimiento con el término de búsqueda "${term}"`);
    }

    return tiposMovimiento;
  }

  async update(id: number, updateTipoMovimientoDto: UpdateTipoMovimientoDto) {
    const tipoMovimiento = await this.findOne(id);
    Object.assign(tipoMovimiento, updateTipoMovimientoDto);
    try {
      return await this.tipoMovimientoRepository.save(tipoMovimiento);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El tipo de movimiento '${updateTipoMovimientoDto.tipo_movimiento}' ya existe.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const tipoMovimiento = await this.findOne(id);
    return await this.tipoMovimientoRepository.remove(tipoMovimiento);
  }
}
