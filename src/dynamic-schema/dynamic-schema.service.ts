import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DynamicSchemaService {
  createDynamicTable(body: any) {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(DynamicSchemaService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async createFromJson(body: any) {
    const tableName: string = body.tableName;
    if (!tableName) throw new Error('tableName es requerido en el JSON');

    const options = body.options || {};
    const dtoValidation = options.dtoValidation === true;
    const timestamps = options.timestamps !== false; // por defecto true
    const singularIdFromTable = options.singularIdFromTable !== false; // default true

    // id
    const idCfg = body.id || {};
    const idName =
      idCfg.name ||
      (singularIdFromTable ? this.buildIdName(tableName) : `id_${tableName}`);
    const idType = (idCfg.type || 'serial').toLowerCase();

    // columnas pasadas
    const cols = Array.isArray(body.columns) ? body.columns : [];

    // Agregar timestamps si aplica
    if (timestamps) {
      cols.push({
        name: 'fecha_creacion',
        type: 'timestamp',
        default: 'NOW()',
      });
      cols.push({
        name: 'fecha_modificacion',
        type: 'timestamp',
        default: 'NOW()',
      });
    }

    // 1. Crear SQL dinámico
    const sqlParts: string[] = [];

    // id
    if (idType === 'serial') {
      sqlParts.push(`${idName} SERIAL PRIMARY KEY`);
    } else {
      sqlParts.push(
        `${idName} ${this.sqlTypeFromField({ type: idType })} PRIMARY KEY`,
      );
    }

    // resto
    for (const c of cols) {
      // skip if duplicate id name
      if (c.name === idName) continue;
      const nullable = c.nullable === false ? 'NOT NULL' : '';
      const unique = c.unique ? 'UNIQUE' : '';
      const length = c.length ? `(${c.length})` : '';
      const sqlType =
        c.type.toLowerCase() === 'varchar'
          ? `VARCHAR${length}`
          : this.sqlTypeFromField(c);
      const def =
        c.default !== undefined
          ? `DEFAULT ${this.formatDefault(c.default)}`
          : '';
      sqlParts.push(
        `${c.name} ${sqlType} ${unique} ${nullable} ${def}`
          .replace(/\s+/g, ' ')
          .trim(),
      );
    }

    const createSql = `CREATE TABLE IF NOT EXISTS ${tableName} (${sqlParts.join(', ')});`;
    await this.connection.query(createSql);
    this.logger.log(`🟢 Tabla "${tableName}" creada correctamente`);

    // 2. Crear carpeta del módulo
    const baseDir = path.join(process.cwd(), 'src', tableName);
    fs.mkdirSync(baseDir, { recursive: true });
    fs.mkdirSync(path.join(baseDir, 'dto'), { recursive: true });
    fs.mkdirSync(path.join(baseDir, 'entities'), { recursive: true });

    // 3. Generar Entity
    const entityName = this.pascal(tableName);
    const entityFile = path.join(baseDir, 'entities', `${tableName}.entity.ts`);
    const entityContent = this.buildEntityContent(
      entityName,
      tableName,
      idName,
      idType,
      cols,
      timestamps,
    );
    fs.writeFileSync(entityFile, entityContent);
    this.logger.log(`📄 Entity escrita en ${entityFile}`);

    // 4. Generar DTOs
    const createDtoFile = path.join(
      baseDir,
      'dto',
      `create-${tableName}.dto.ts`,
    );
    const updateDtoFile = path.join(
      baseDir,
      'dto',
      `update-${tableName}.dto.ts`,
    );
    fs.writeFileSync(
      createDtoFile,
      this.buildCreateDtoContent(entityName, cols, dtoValidation),
    );
    fs.writeFileSync(updateDtoFile, this.buildUpdateDtoContent(entityName));
    this.logger.log(`📝 DTOs creados`);

    // 5. Generar Service
    const serviceFile = path.join(baseDir, `${tableName}.service.ts`);
    fs.writeFileSync(
      serviceFile,
      this.buildServiceContent(entityName, tableName, idName),
    );
    this.logger.log(`🛠 Service creado`);

    // 6. Generar Controller
    const controllerFile = path.join(baseDir, `${tableName}.controller.ts`);
    fs.writeFileSync(
      controllerFile,
      this.buildControllerContent(entityName, tableName),
    );
    this.logger.log(`🚪 Controller creado`);

    // 7. Generar Module
    const moduleFile = path.join(baseDir, `${tableName}.module.ts`);
    fs.writeFileSync(
      moduleFile,
      this.buildModuleContent(entityName, tableName),
    );
    this.logger.log(`📦 Module creado`);

    return { message: `Tabla ${tableName} y módulo ${tableName} generados.` };
  }

  /* ---------- Helpers y builders ---------- */

  private sqlTypeFromField(f: any): string {
    const t = (f.type || '').toLowerCase();
    if (t === 'int') return 'INTEGER';
    if (t === 'decimal') return 'DECIMAL';
    if (t === 'text') return 'TEXT';
    if (t === 'boolean') return 'BOOLEAN';
    if (t === 'timestamp') return 'TIMESTAMP';
    if (t === 'varchar') return `VARCHAR(${f.length || 255})`;
    if (t === 'serial') return 'SERIAL';
    return (f.type || 'TEXT').toUpperCase();
  }

  private formatDefault(def: any) {
    if (typeof def === 'string') {
      // if looks like function NOW() or expression, keep as is
      if (def.toUpperCase().includes('NOW()') || def.includes('()')) return def;
      return `'${def}'`;
    }
    return String(def);
  }

  private buildEntityContent(
    entityName: string,
    tableName: string,
    idName: string,
    idType: string,
    cols: any[],
    timestamps: boolean,
  ) {
    const imports = [
      `import { Entity, PrimaryGeneratedColumn, Column${timestamps ? ', CreateDateColumn, UpdateDateColumn' : ''} } from 'typeorm';`,
    ].join('\n');

    const fieldsLines: string[] = [];

    // id
    if (idType === 'serial') {
      fieldsLines.push(`  @PrimaryGeneratedColumn({ name: '${idName}' })`);
      fieldsLines.push(`  ${idName}: number;\n`);
    } else {
      fieldsLines.push(`  @PrimaryGeneratedColumn({ name: '${idName}' })`);
      fieldsLines.push(`  ${idName}: number;\n`);
    }

    for (const c of cols) {
      // skip timestamps handled separately
      if (
        timestamps &&
        (c.name === 'fecha_creacion' || c.name === 'fecha_modificacion')
      )
        continue;

      const opts: string[] = [];
      if (c.length && c.type.toLowerCase() === 'varchar')
        opts.push(`length: ${c.length}`);
      if (c.unique) opts.push('unique: true');
      if (c.nullable) opts.push('nullable: true');
      if (c.default !== undefined) {
        const def =
          typeof c.default === 'string' &&
          c.default.toUpperCase().includes('NOW()')
            ? `() => '${c.default}'`
            : JSON.stringify(c.default);
        // for default, we'll set via default property for simple values
        if (typeof c.default === 'boolean' || typeof c.default === 'number')
          opts.push(`default: ${c.default}`);
        else if (
          typeof c.default === 'string' &&
          c.default.toUpperCase().includes('NOW()')
        ) {
          // handled in timestamp columns
        } else opts.push(`default: ${JSON.stringify(c.default)}`);
      }

      const colOptions = opts.length ? `{ ${opts.join(', ')} }` : '';
      fieldsLines.push(`  @Column(${colOptions})`);
      // TS type mapping
      const tsType = this.tsTypeFromSql(c.type);
      fieldsLines.push(`  ${c.name}: ${tsType};\n`);
    }

    if (timestamps) {
      fieldsLines.push(`  @CreateDateColumn()\n  fecha_creacion: Date;\n`);
      fieldsLines.push(`  @UpdateDateColumn()\n  fecha_modificacion: Date;\n`);
    }

    return `${imports}

@Entity('${tableName}')
export class ${entityName} {
${fieldsLines.join('\n')}
}
`;
  }

  private tsTypeFromSql(sqlType: string) {
    const t = (sqlType || '').toLowerCase();
    if (t.includes('int') || t.includes('decimal') || t === 'serial')
      return 'number';
    if (t.includes('varchar') || t === 'text') return 'string';
    if (t.includes('timestamp')) return 'Date';
    if (t === 'boolean') return 'boolean';
    return 'any';
  }

  private buildCreateDtoContent(
    entityName: string,
    cols: any[],
    dtoValidation: boolean,
  ) {
    const imports: string[] = [];
    const lines: string[] = [];
    if (dtoValidation) {
      imports.push(
        `import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';`,
      );
    }
    for (const c of cols) {
      // skip timestamp fields in create dto defaults
      if (c.name === 'fecha_creacion' || c.name === 'fecha_modificacion')
        continue;
      const tsType = this.tsTypeFromSql(c.type);
      if (dtoValidation) {
        if (tsType === 'string')
          lines.push(`  @IsString()\n  ${c.name}: string;\n`);
        else if (tsType === 'number')
          lines.push(`  @IsInt()\n  ${c.name}: number;\n`);
        else if (tsType === 'boolean')
          lines.push(`  @IsBoolean()\n  ${c.name}: boolean;\n`);
        else lines.push(`  @IsOptional()\n  ${c.name}: any;\n`);
      } else {
        lines.push(`  ${c.name}: ${tsType};\n`);
      }
    }

    return `${imports.join('\n')}

export class Create${entityName}Dto {
${lines.join('\n')}
}
`;
  }

  private buildUpdateDtoContent(entityName: string) {
    return `import { PartialType } from '@nestjs/mapped-types';
import { Create${entityName}Dto } from './create-${this.kebab(entityName)}.dto';

export class Update${entityName}Dto extends PartialType(Create${entityName}Dto) {}
`;
  }

  private buildServiceContent(
    entityName: string,
    tableName: string,
    idName: string,
  ) {
    const repoType = entityName;
    const repoImport = `import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { Repository } from 'typeorm';\nimport { Create${entityName}Dto } from './dto/create-${tableName}.dto';\nimport { Update${entityName}Dto } from './dto/update-${tableName}.dto';\nimport { ${entityName} } from './entities/${tableName}.entity';\n\n`;
    return `${repoImport}
@Injectable()
export class ${entityName}Service {
  constructor(
    @InjectRepository(${entityName})
    private readonly repo: Repository<${entityName}>,
  ) {}

  async create(createDto: Create${entityName}Dto) {
    try {
      const entity = this.repo.create(createDto);
      return await this.repo.save(entity);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Registro duplicado');
      }
      throw error;
    }
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const e = await this.repo.findOne({ where: { ${idName}: id } as any });
    if (!e) throw new NotFoundException(\`Registro con ID \${id} no encontrado\`);
    return e;
  }

  async update(id: number, updateDto: Update${entityName}Dto) {
    const e = await this.findOne(id);
    Object.assign(e, updateDto);
    try {
      return await this.repo.save(e);
    } catch (error) {
      if (error.code === '23505') throw new ConflictException('Actualización viola unicidad');
      throw error;
    }
  }

  async remove(id: number) {
    const e = await this.findOne(id);
    try {
      await this.repo.remove(e);
      return { message: \`Registro con ID \${id} eliminado\` };
    } catch (error) {
      if (error.code === '23503') throw new ConflictException('No se puede eliminar, tiene relaciones');
      throw error;
    }
  }
}
`;
  }

  private buildControllerContent(entityName: string, tableName: string) {
    return `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${entityName}Service } from './${tableName}.service';
import { Create${entityName}Dto } from './dto/create-${tableName}.dto';
import { Update${entityName}Dto } from './dto/update-${tableName}.dto';

@Controller('${tableName}')
export class ${entityName}Controller {
  constructor(private readonly service: ${entityName}Service) {}

  @Post()
  create(@Body() createDto: Create${entityName}Dto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Update${entityName}Dto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
`;
  }

  private buildModuleContent(entityName: string, tableName: string) {
    return `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${entityName} } from './entities/${tableName}.entity';
import { ${entityName}Service } from './${tableName}.service';
import { ${entityName}Controller } from './${tableName}.controller';

@Module({
  imports: [TypeOrmModule.forFeature([${entityName}])],
  controllers: [${entityName}Controller],
  providers: [${entityName}Service],
  exports: [${entityName}Service],
})
export class ${entityName}Module {}
`;
  }

  private buildIdName(tableName: string) {
    // animales -> animal ; productos -> producto (very simple)
    const singular = tableName.endsWith('s')
      ? tableName.slice(0, -1)
      : tableName;
    return `id_${singular}`;
  }

  private pascal(s: string) {
    return s
      .split(/[_-]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
  }

  private kebab(s: string) {
    return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
