import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Movimiento } from './entities/movimiento.entity';

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto) {
    const movimiento = this.movimientoRepository.create({
      ...createMovimientoDto,
      usuario: { id_usuario: createMovimientoDto.usuario_id },
      usuario_responsable: createMovimientoDto.usuario_responsable_id ? { id_usuario: createMovimientoDto.usuario_responsable_id } : undefined,
      tipo_movimiento_id: { id_tipo_movimiento: createMovimientoDto.tipo_movimiento },
      material_id: createMovimientoDto.material_id ? { id_material: createMovimientoDto.material_id } : undefined,
      sitio: { id_sitio: createMovimientoDto.sitio_id },
    });
    return await this.movimientoRepository.save(movimiento);
  }

  async findAll() {
    return await this.movimientoRepository.find({
      relations: ['usuario', 'usuario_responsable', 'tipo_movimiento_id', 'material_id', 'sitio'],
    });
  }

  async findOne(id: number) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id_movimiento: id },
      relations: ['usuario', 'usuario_responsable', 'tipo_movimiento_id', 'material_id', 'sitio'],
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    return movimiento;
  }

  async search(term: string) {
    const movimientos = await this.movimientoRepository.find({
      relations: ['usuario', 'usuario_responsable', 'tipo_movimiento_id', 'material_id', 'sitio'],
    });

    if (!movimientos.length) {
      throw new NotFoundException(`No se encontraron movimientos con el término de búsqueda "${term}"`);
    }

    return movimientos;
  }

  async update(id: number, updateMovimientoDto: UpdateMovimientoDto) {
    const movimiento = await this.findOne(id);
    Object.assign(movimiento, updateMovimientoDto);
    return await this.movimientoRepository.save(movimiento);
  }

  async remove(id: number) {
    const movimiento = await this.findOne(id);
    return await this.movimientoRepository.remove(movimiento);
  }
}
