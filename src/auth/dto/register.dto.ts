import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsNumber()
  @IsNotEmpty()
  edad: number;

  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  confirmar_contrasena: string;

  @IsNumber()
  @IsNotEmpty()
  rol_id: number;
}
