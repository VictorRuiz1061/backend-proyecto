// src/seeders/seed.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Rol } from '../roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.run();
  }

  async run() {
    this.logger.log('🌱 Ejecutando seed de datos iniciales...');

    // 1️⃣ Crear roles base
    const rolesBase = [
      {
        id_rol: 1,
        nombre_rol: 'Administrador',
        descripcion: 'Acceso total al sistema',
        estado: true,
      },
      {
        id_rol: 2,
        nombre_rol: 'Usuario',
        descripcion: 'Acceso limitado al sistema',
        estado: true,
      },
    ];

    for (const rol of rolesBase) {
      const existe = await this.rolRepository.findOne({ where: { id_rol: rol.id_rol } });
      if (!existe) {
        await this.rolRepository.save(rol);
        this.logger.log(`✅ Rol "${rol.nombre_rol}" creado`);
      }
    }

    // 2️⃣ Datos del admin desde .env
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminCedula = this.configService.get<string>('ADMIN_CEDULA');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminNombre = this.configService.get<string>('ADMIN_NAME');
    const adminApellido = this.configService.get<string>('ADMIN_LASTNAME');
    const adminTelefono = this.configService.get<string>('ADMIN_PHONE');
    const adminRolId = this.configService.get<number>('ADMIN_ROLE_ID') ?? 1;

    const adminExist = await this.usuarioRepository.findOne({
      where: [{ email: adminEmail }, { cedula: adminCedula }],
    });

    if (!adminExist) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const admin = this.usuarioRepository.create({
        nombre: adminNombre,
        apellido: adminApellido,
        edad: 30,
        cedula: adminCedula,
        telefono: adminTelefono,
        email: adminEmail,
        contrasena: hashedPassword,
        rol_id: adminRolId,
        estado: true,
      });

      await this.usuarioRepository.save(admin);
      this.logger.log(`✅ Usuario administrador (${adminEmail}) creado correctamente`);
    } else {
      this.logger.log(`ℹ️ El usuario administrador (${adminEmail}) ya existe`);
    }

    this.logger.log('🌾 Seed completado.');
  }
}
