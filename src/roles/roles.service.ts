import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const rol = this.rolRepository.create(createRoleDto);
    return await this.rolRepository.save(rol);
  }

  async findAll() {
    return await this.rolRepository.find({
      relations: ['usuarios', 'permisos'],
    });
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOne({
      where: { id_rol: id },
      relations: ['usuarios', 'permisos'],
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  async search(term: string) {
    const roles = await this.rolRepository.find({
      where: [
        { nombre_rol: Like(`%${term}%`) },
        { descripcion: Like(`%${term}%`) },
      ],
      relations: ['usuarios', 'permisos'],
    });

    if (!roles.length) {
      throw new NotFoundException(`No se encontraron roles con el término de búsqueda "${term}"`);
    }

    return roles;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRoleDto);
    return await this.rolRepository.save(rol);
  }

  async remove(id: number) {
    const rol = await this.findOne(id);
    return await this.rolRepository.remove(rol);
  }
}
