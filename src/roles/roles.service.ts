import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    try {
      const rol = this.rolRepository.create(createRoleDto);
      return await this.rolRepository.save(rol);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El rol con el nombre '${createRoleDto.nombre_rol}' ya existe.`);
      }
      throw error;
    }
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
    try {
      return await this.rolRepository.save(rol);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El rol con el nombre '${updateRoleDto.nombre_rol}' ya existe.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const rol = await this.findOne(id);
    try {
      await this.rolRepository.remove(rol);
      return { message: `El rol con ID ${id} ha sido eliminado` };
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('Este rol no se puede eliminar porque está asignado a uno o más permisos o usuarios.');
      }
      throw error;
    }
  }
}
