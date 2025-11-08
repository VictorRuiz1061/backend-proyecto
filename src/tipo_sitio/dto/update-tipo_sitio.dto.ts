import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoSitioDto } from './create-tipo_sitio.dto';

export class UpdateTipoSitioDto extends PartialType(CreateTipoSitioDto) {}
