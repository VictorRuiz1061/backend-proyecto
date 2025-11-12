import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventario } from './entities/inventario.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
  ) {}

  async create(createInventarioDto: CreateInventarioDto) {
    const inventario = this.inventarioRepository.create(createInventarioDto);
    return await this.inventarioRepository.save(inventario);
  }

  async findAll() {
    return await this.inventarioRepository.find({
      relations: ['sitio'],
    });
  }

  async findOne(id: number) {
    const inventario = await this.inventarioRepository.findOne({
      where: { id_inventario: id },
      relations: ['sitio'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async search(term: string) {
    const inventarios = await this.inventarioRepository.find({
      where: [
        { placa_sena: Like(`%${term}%`) },
        { descripcion: Like(`%${term}%`) },
      ],
      relations: ['sitio'],
    });

    if (!inventarios.length) {
      throw new NotFoundException(`No se encontraron inventarios con el término de búsqueda "${term}"`);
    }

    return inventarios;
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto) {
    const inventario = await this.findOne(id);
    Object.assign(inventario, updateInventarioDto);
    return await this.inventarioRepository.save(inventario);
  }

  async remove(id: number) {
    const inventario = await this.findOne(id);
    return await this.inventarioRepository.remove(inventario);
  }
}
