import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposMovimientoDto } from './create-tipo_movimiento.dto';

export class UpdateTipoMovimientoDto extends PartialType(CreateTiposMovimientoDto) {}
