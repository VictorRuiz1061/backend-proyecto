import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty({ message: 'El nombre del área no puede estar vacío.' })
  @IsString({ message: 'El nombre del área debe ser una cadena de texto.' })
  nombre_area: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano (verdadero/falso).'})
  estado: boolean;
}
