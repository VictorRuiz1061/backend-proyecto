import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    try {
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('La cédula o el email ya están registrados.');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.usuarioRepository.find({
      relations: ['rol', 'movimientos', 'fichas'],
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      relations: ['rol', 'movimientos', 'fichas'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async search(term: string) {
    const usuarios = await this.usuarioRepository.find({
      where: [
        { nombre: Like(`%${term}%`) },
        { apellido: Like(`%${term}%`) },
        { cedula: Like(`%${term}%`) },
        { email: Like(`%${term}%`) },
      ],
      relations: ['rol', 'movimientos', 'fichas'],
    });

    if (!usuarios.length) {
      throw new NotFoundException(`No se encontraron usuarios con el término de búsqueda "${term}"`);
    }

    return usuarios;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    Object.assign(usuario, updateUsuarioDto);
    try {
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('La cédula o el email ya están registrados.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    try {
      await this.usuarioRepository.remove(usuario);
      return { message: `El usuario con ID ${id} ha sido eliminado` };
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('Este usuario no se puede eliminar porque tiene registros asociados.');
      }
      throw error;
    }
  }
}
