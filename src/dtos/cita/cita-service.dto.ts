import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoCita, TipoCita } from '@prisma/client';

export class QueryCitaDto {
  @ApiPropertyOptional({
    enum: EstadoCita,
    example: 'PENDIENTE',
    description: 'Filtrar por estado de la cita',
  })
  @IsEnum(EstadoCita)
  @IsOptional()
  estado?: EstadoCita;

  @ApiPropertyOptional({
    enum: TipoCita,
    example: 'CONSULTA',
    description: 'Filtrar por tipo de cita',
  })
  @IsEnum(TipoCita)
  @IsOptional()
  tipo?: TipoCita;

  @ApiPropertyOptional({
    description: 'Search term to filter citas by mascota name or raza',
    example: 'Fido',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
    type: 'integer', // ← agregar esto
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
    default: 10,
    minimum: 1,
    type: 'integer', // ← agregar esto
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit = 10;
}
