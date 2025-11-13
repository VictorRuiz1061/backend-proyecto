import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  // 🧩 Registro de usuario
  async register(registerDto: RegisterDto) {
    const { email, contrasena, confirmar_contrasena, cedula } = registerDto;

    // 1️⃣ Verificar contraseñas iguales
    if (contrasena !== confirmar_contrasena) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // 2️⃣ Verificar email o cédula únicos
    const existe = await this.usuarioRepository.findOne({
      where: [{ email }, { cedula }],
    });

    if (existe) {
      if (existe.email === email) {
        throw new BadRequestException(
          'El correo electrónico ya está registrado',
        );
      }
      if (existe.cedula === cedula) {
        throw new BadRequestException('La cédula ya está registrada');
      }
    }

    // 3️⃣ Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // 4️⃣ Crear y guardar usuario
    const nuevoUsuario = this.usuarioRepository.create({
      ...registerDto,
      contrasena: hashedPassword,
    });

    await this.usuarioRepository.save(nuevoUsuario);

    // 5️⃣ Retornar sin contraseña
    const { contrasena: _, ...usuarioSinPass } = nuevoUsuario;
    return usuarioSinPass;
  }

  // 🔐 Login
  async login(loginDto: LoginDto) {
    const { email, contrasena } = loginDto;

    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );
    if (!contrasenaValida) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // Generar token JWT
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      rol_id: usuario.rol_id,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol_id: usuario.rol_id,
      },
    };
  }

  // 👤 Obtener perfil desde token
  async getProfile(usuario: Usuario) {
    return usuario;
  }
}
