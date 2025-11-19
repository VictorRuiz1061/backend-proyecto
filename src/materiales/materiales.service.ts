import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { Material } from './entities/materiale.entity';
import { ImageService } from 'src/common/services/image.service';

@Injectable()
export class MaterialesService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    private readonly imageService: ImageService,
  ) {}

  async create(dto: CreateMaterialeDto, file?: Express.Multer.File) {
    let imagePath: string | undefined = undefined;

    if (file) {
      imagePath = await this.imageService.saveImage(file, 'materiales');
    }

    const material = this.materialRepository.create({
      ...dto,
      imagen: imagePath, // si undefined, TypeORM omite la columna si está en blanco/nullable
      categoria_id: { id_categoria_elemento: dto.categoria_id },
      tipo_material_id: { id_tipo_material: dto.tipo_material_id },
    });

    return await this.materialRepository.save(material);
  }

  async findAll() {
    return await this.materialRepository.find({
      relations: [
        'movimientos',
        'caracteristicas',
        'tipo_material_id',
        'categoria_id',
      ],
    });
  }

  async findOne(id: number) {
    const material = await this.materialRepository.findOne({
      where: { id_material: id },
      relations: [
        'movimientos',
        'caracteristicas',
        'tipo_material_id',
        'categoria_id',
      ],
    });

    if (!material) {
      throw new NotFoundException(`Material con ID ${id} no encontrado`);
    }

    return material;
  }

  async search(term: string) {
    const materiales = await this.materialRepository.find({
      where: [
        { nombre_material: Like(`%${term}%`) },
        { codigo_sena: Like(`%${term}%`) },
      ],
      relations: ['movimientos', 'caracteristicas', 'tipo_material_id', 'categoria_id'],
    });

    if (!materiales.length) {
      throw new NotFoundException(
        `No se encontraron materiales con el término "${term}"`,
      );
    }

    return materiales;
  }

  async update(id: number, dto: UpdateMaterialeDto, file?: Express.Multer.File) {
    const material = await this.findOne(id);

    if (file) {
      if (material.imagen) {
        await this.imageService.deleteImage(material.imagen);
      }
      material.imagen = await this.imageService.saveImage(file, 'materiales');
    }

    Object.assign(material, dto);

    return await this.materialRepository.save(material);
  }

  async remove(id: number) {
    const material = await this.findOne(id);

    if (material.imagen) {
      await this.imageService.deleteImage(material.imagen);
    }

    try {
      await this.materialRepository.remove(material);
      return { message: `Material con ID ${id} eliminado` };
    } catch (error) {
      if ((error as any).code === '23503') {
        throw new ConflictException(
          'Este material no se puede eliminar porque tiene relaciones activas.',
        );
      }
      throw error;
    }
  }
}
