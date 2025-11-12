import { IsInt, IsNotEmpty, IsPositive, IsString, ValidateIf } from 'class-validator';

export class CreateInventarioDto {
  @IsInt({ message: 'El ID del sitio debe ser un número entero.' })
  @IsNotEmpty({ message: 'El ID del sitio no puede estar vacío.' })
  sitio_id: number;

  @IsInt({ message: 'El ID del material debe ser un número entero.' })
  @IsNotEmpty({ message: 'El ID del material no puede estar vacío.' })
  material_id: number;

  @IsInt({ message: 'El stock debe ser un número entero.' })
  @IsPositive({ message: 'El stock debe ser un número positivo.' })
  stock: number;

  @IsString({ message: 'La placa SENA debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La placa SENA es requerida para este material.' })
  placa_sena?: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es requerida para este material.' })
  descripcion?: string;
}
