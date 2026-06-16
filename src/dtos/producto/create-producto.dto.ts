import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @ApiProperty({
    example: 'Amoxicilina 500mg',
    description: 'Nombre del producto',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Antibiótico para perros y gatos',
    description: 'Descripción del producto',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;

  @ApiProperty({
    example: 25.99,
    description: 'Precio del producto',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Stock disponible',
    default: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: 'AMOX-500',
    description: 'Código único del producto',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiPropertyOptional({
    example: 'https://imagen.com/producto.jpg',
    description: 'URL de la imagen del producto',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el producto está activo',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: 'uuid-de-la-categoria',
    description: 'ID de la categoría del producto',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
