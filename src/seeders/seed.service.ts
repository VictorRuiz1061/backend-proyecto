import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Rol } from '../roles/entities/role.entity';
import { Modulo } from '../modulos/entities/modulo.entity';
import { Permiso } from '../permisos/entities/permiso.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Modulo)
    private readonly moduloRepository: Repository<Modulo>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
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
        nombre_rol: 'Administrador',
        descripcion: 'Acceso total al sistema',
        estado: true,
      },
      {
        nombre_rol: 'Usuario',
        descripcion: 'Acceso limitado al sistema',
        estado: true,
      },
    ];

    for (const rol of rolesBase) {
      const existe = await this.rolRepository.findOne({ where: { nombre_rol: rol.nombre_rol } });
      if (!existe) {
        await this.rolRepository.save(rol);
        this.logger.log(`✅ Rol "${rol.nombre_rol}" creado`);
      }
    }

    const rolAdmin = await this.rolRepository.findOne({ where: { nombre_rol: 'Administrador' } });

    // 2️⃣ Crear usuario admin desde .env
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminCedula = this.configService.get<string>('ADMIN_CEDULA');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminNombre = this.configService.get<string>('ADMIN_NAME');
    const adminApellido = this.configService.get<string>('ADMIN_LASTNAME');
    const adminTelefono = this.configService.get<string>('ADMIN_PHONE');

    const adminExist = await this.usuarioRepository.findOne({
      where: [{ email: adminEmail }, { cedula: adminCedula }],
    });

    if (!adminExist && rolAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = this.usuarioRepository.create({
        nombre: adminNombre,
        apellido: adminApellido,
        edad: 30,
        cedula: adminCedula,
        telefono: adminTelefono,
        email: adminEmail,
        contrasena: hashedPassword,
        rol_id: rolAdmin.id_rol, // ✅ Usa ID del rol
        estado: true,
      } as any);
      await this.usuarioRepository.save(admin);
      this.logger.log(`✅ Usuario administrador (${adminEmail}) creado correctamente`);
    } else {
      this.logger.log(`ℹ️ El usuario administrador (${adminEmail}) ya existe`);
    }

    // 3️⃣ Crear módulos desde modulos.json
    const modulosPath = path.join(__dirname, '../../modulos.json');
    const modulosFile = fs.readFileSync(modulosPath, 'utf8');
    const modulosData = JSON.parse(modulosFile).data.data;

    // Crear módulos padres
    const padres = modulosData.filter((m) => !m.es_submenu);
    for (const padre of padres) {
      const existePadre = await this.moduloRepository.findOne({
        where: { rutas: padre.rutas },
      });
      if (!existePadre) {
        const nuevoPadre = this.moduloRepository.create({
          rutas: padre.rutas,
          descripcion_ruta: padre.descripcion_ruta,
          mensaje_cambio: padre.mensaje_cambio,
          imagen: padre.imagen,
          estado: padre.estado,
          es_submenu: false,
          modulo_padre_id: null, // ✅ ahora permitido
        } as any);
        await this.moduloRepository.save(nuevoPadre);
        this.logger.log(`📁 Módulo padre "${padre.descripcion_ruta}" creado`);
      }
    }

    // Crear submódulos (hijos)
    const hijos = modulosData.filter((m) => m.es_submenu);
    for (const hijo of hijos) {
      const padre = await this.moduloRepository.findOne({
        where: { id_modulo: hijo.modulo_padre_id },
      });

      const existeHijo = await this.moduloRepository.findOne({
        where: { rutas: hijo.rutas },
      });

      if (!existeHijo) {
        const nuevoHijo = this.moduloRepository.create({
          rutas: hijo.rutas,
          descripcion_ruta: hijo.descripcion_ruta,
          mensaje_cambio: hijo.mensaje_cambio,
          imagen: hijo.imagen,
          estado: hijo.estado,
          es_submenu: true,
          modulo_padre_id: padre ? padre.id_modulo : null,
        } as any);
        await this.moduloRepository.save(nuevoHijo);
        this.logger.log(`🧩 Submódulo "${hijo.descripcion_ruta}" creado`);
      }
    }

    // 4️⃣ Crear permiso global para el rol administrador
    const todosLosModulos = await this.moduloRepository.find();
    const modulosIds = todosLosModulos.map((m) => m.id_modulo);

    const permisoExist = await this.permisoRepository.findOne({
      where: { rol_id: { id_rol: rolAdmin?.id_rol } },
    });

    if (!permisoExist && rolAdmin) {
      const permiso = this.permisoRepository.create({
        rol_id: rolAdmin,
        modulo_id: modulosIds, // ✅ se usa 'simple-array'
        nombre: 'Permiso Global',
        estado: true,
        puede_ver: true,
        puede_crear: true,
        puede_actualizar: true,
        puede_eliminar: true,
      } as any);
      await this.permisoRepository.save(permiso);
      this.logger.log('🔑 Permiso global creado para el rol Administrador');
    } else {
      this.logger.log('ℹ️ Permiso global ya existe o rol no encontrado');
    }

    this.logger.log('🌾 Seed completado.');
  }
}
