import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoMaterialDto } from './create-tipo_material.dto';

export class UpdateTipoMaterialDto extends PartialType(CreateTipoMaterialDto) {}
