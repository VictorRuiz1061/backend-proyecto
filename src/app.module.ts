import { Module } from '@nestjs/common';
import { AreasModule } from './areas/areas.module';
import { FichasModule } from './fichas/fichas.module';
import { ProgramasModule } from './programas/programas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MovimientoModule } from './movimientos/movimiento.module';
import { TipoMovimientoModule } from './tipo_movimiento/tipo_movimiento.module';
import { MaterialesModule } from './materiales/materiales.module';
import { SitioModule } from './sitios/sitio.module';
import { TipoSitioModule } from './tipo_sitio/tipo_sitio.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { ModulosModule } from './modulos/modulos.module';
import { CaracteristicasModule } from './caracteristicas/caracteristicas.module';
import { InventarioModule } from './inventario/inventario.module';
import { TipoMaterialModule } from './tipo_material/tipo_material.module';
import { CategoriaElementoModule } from './categoria_elemento/categoria_elemento.module';

@Module({
  imports: [
    AreasModule,
    FichasModule,
    ProgramasModule,
    UsuariosModule,
    MovimientoModule,
    TipoMovimientoModule,
    MaterialesModule,
    SitioModule,
    TipoSitioModule,
    RolesModule,
    PermisosModule,
    ModulosModule,
    CaracteristicasModule,
    InventarioModule,
    TipoMaterialModule,
    CategoriaElementoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
