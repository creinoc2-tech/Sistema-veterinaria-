import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Especie } from '@prisma/client';

export class QueryMascotaDto {
  @ApiPropertyOptional({
    enum: Especie,
    example: 'PERRO',
    description: 'Filtrar por especie',
  })
  @IsEnum(Especie)
  @IsOptional()
  especie?: Especie;

  @ApiPropertyOptional({
    description: 'Search term to filter mascotas by name or raza',
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
