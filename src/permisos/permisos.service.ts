import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { Permiso } from './entities/permiso.entity';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  async create(createPermisoDto: CreatePermisoDto) {
    const permiso = this.permisoRepository.create({
      ...createPermisoDto,
      rol_id: { id_rol: createPermisoDto.rol_id },
    });
    return await this.permisoRepository.save(permiso);
  }

  async findAll() {
    return await this.permisoRepository.find({
      relations: ['rol_id'],
    });
  }

  async findOne(id: number) {
    const permiso = await this.permisoRepository.findOne({
      where: { id_permiso: id },
      relations: ['rol_id'],
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    return permiso;
  }

  async search(term: string) {
    const permisos = await this.permisoRepository.find({
      where: [
        { nombre: Like(`%${term}%`) },
        // Add more search criteria based on related entities if needed
      ],
      relations: ['rol_id'],
    });

    if (!permisos.length) {
      throw new NotFoundException(`No se encontraron permisos con el término de búsqueda "${term}"`);
    }

    return permisos;
  }

  async update(id: number, updatePermisoDto: UpdatePermisoDto) {
    const permiso = await this.findOne(id);
    Object.assign(permiso, updatePermisoDto);
    return await this.permisoRepository.save(permiso);
  }

  async remove(id: number) {
    const permiso = await this.findOne(id);
    return await this.permisoRepository.remove(permiso);
  }
}
