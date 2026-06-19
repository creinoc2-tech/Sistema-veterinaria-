import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoCita, TipoCita } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCitaDto {
  @ApiProperty({
    example: '2020-01-01T00:00:00.000Z',
    description: 'Fecha de la cita',
    type: 'string', // ← agregar esto
    format: 'date-time', // ← agregar esto
  })
  @IsISO8601()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty({
    example: '14:30',
    description: 'Hora de la cita',
    type: 'string', // ← agregar esto
  })
  @IsString()
  @IsNotEmpty()
  hora: string;

  @ApiProperty({
    example: 'Consulta general',
    description: 'Motivo de la cita',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  motivo: string;

  @ApiProperty({
    description: 'Estado de la cita',
    example: 'PENDIENTE',
  })
  @IsEnum(EstadoCita, { message: 'Invalid role' })
  @IsNotEmpty()
  estado: EstadoCita;

  @ApiProperty({
    description: 'Tipo de la cita',
    example: 'CONSULTA',
  })
  @IsEnum(TipoCita, { message: 'Invalid type' })
  @IsNotEmpty()
  tipo: TipoCita;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Traer resultados de laboratorio',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  notas?: string;

  @ApiPropertyOptional({
    example: 'uuid-de-la-mascota',
    description: 'ID de la mascota (solo ADMIN/RECEPCIONISTA)',
  })
  @IsString()
  @IsNotEmpty()
  mascotaId: string;

  @ApiPropertyOptional({
    example: 'uuid-del-veterinario',
    description: 'ID del veterinario (solo ADMIN/RECEPCIONISTA)',
  })
  @IsString()
  @IsNotEmpty()
  veterinarioId: string;

  @ApiPropertyOptional({
    example: 'uuid-del-usuario',
    description: 'ID del usuario que creó la cita (solo ADMIN/RECEPCIONISTA)',
  })
  @IsString()
  @IsNotEmpty()
  creadoPorId: string;

  @ApiPropertyOptional({
    example: 'uuid-del-usuario',
    description: 'ID del usuario que creó la cita (solo ADMIN/RECEPCIONISTA)',
  })
  @IsString()
  @IsNotEmpty()
  clienteId: string;
}
