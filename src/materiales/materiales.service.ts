import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { Material } from './entities/materiale.entity';

@Injectable()
export class MaterialesService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async create(createMaterialeDto: CreateMaterialeDto) {
    const material = this.materialRepository.create({
      ...createMaterialeDto,
      categoria_id: { id_categoria_elemento: createMaterialeDto.categoria_id },
      tipo_material_id: { id_tipo_material: createMaterialeDto.tipo_material_id },
    });
    return await this.materialRepository.save(material);
  }

  async findAll() {
    return await this.materialRepository.find({
      relations: ['movimientos', 'caracteristicas', 'tipo_material_id', 'categoria_id'],
    });
  }

  async findOne(id: number) {
    const material = await this.materialRepository.findOne({
      where: { id_material: id },
      relations: ['movimientos', 'caracteristicas', 'tipo_material_id', 'categoria_id'],
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
      throw new NotFoundException(`No se encontraron materiales con el término de búsqueda "${term}"`);
    }

    return materiales;
  }

  async update(id: number, updateMaterialeDto: UpdateMaterialeDto) {
    const material = await this.findOne(id);
    Object.assign(material, updateMaterialeDto);
    return await this.materialRepository.save(material);
  }

  async remove(id: number) {
    const material = await this.findOne(id);
    try {
      await this.materialRepository.remove(material);
      return { message: `El material con ID ${id} ha sido eliminado` };
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('Este material no se puede eliminar porque tiene movimientos o características asociadas.');
      }
      throw error;
    }
  }
}
