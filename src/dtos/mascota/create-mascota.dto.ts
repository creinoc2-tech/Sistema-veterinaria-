import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Especie, Sexo } from '@prisma/client';

export class CreateMascotaDto {
  @ApiProperty({
    example: 'Amoxicilina 500mg',
    description: 'Nombre de la mascota',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Especie de la mascota',
    example: 'PERRO',
  })
  @IsEnum(Especie, { message: 'Invalid role' })
  @IsNotEmpty()
  especie: Especie;

  @ApiProperty({
    example: 'Labrador',
    description: 'Raza de la mascota',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  raza?: string;

  @ApiProperty({
    description: 'Sexo de la mascota',
    example: 'MACHO',
  })
  @IsEnum(Sexo, { message: 'Invalid role' })
  @IsNotEmpty()
  sexo: Sexo;

  @ApiProperty({
    example: '2020-01-01T00:00:00.000Z',
    description: 'Fecha de nacimiento de la mascota',
    type: 'string', // ← agregar esto
    format: 'date-time', // ← agregar esto
  })
  @IsISO8601()
  @IsOptional()
  fechaNac?: string;

  @ApiProperty({
    example: 25.99,
    description: 'Peso de la mascota en kg',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  peso?: number;

  @ApiPropertyOptional({
    example: ' https://imagen.com/mascota.jpg',
    description: 'URL de la imagen de la mascota',
  })
  @IsString()
  @IsOptional()
  foto?: string;

  @ApiPropertyOptional({
    example: 'Marrón con blanco',
    description: 'Color de la mascota',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    example: 'uuid-del-dueno',
    description: 'ID del dueño (solo ADMIN/RECEPCIONISTA)',
  })
  @IsString()
  @IsOptional()
  duenoId?: string;
}
