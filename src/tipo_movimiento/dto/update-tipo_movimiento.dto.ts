import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoMovimientoDto } from './create-tipo_movimiento.dto';

export class UpdateTipoMovimientoDto extends PartialType(CreateTipoMovimientoDto) {}
