import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoMaterialeDto } from './create-tipo_material.dto';

export class UpdateTipoMaterialDto extends PartialType(CreateTipoMaterialeDto) {}
