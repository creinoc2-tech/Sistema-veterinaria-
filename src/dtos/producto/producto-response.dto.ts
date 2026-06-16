import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del producto',
  })
  id: string;

  @ApiProperty({
    example: 'Amoxicilina 500mg',
    description: 'Nombre del producto',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Antibiótico para perros y gatos',
    description: 'Descripción del producto',
  })
  descripcion?: string | null;

  @ApiProperty({
    example: 25.99,
    description: 'Precio del producto',
  })
  precio: number;

  @ApiProperty({
    example: 100,
    description: 'Stock disponible',
  })
  stock: number;

  @ApiProperty({
    example: 'AMOX-500',
    description: 'Código único del producto',
  })
  sku: string;

  @ApiPropertyOptional({
    example: 'https://imagen.com/producto.jpg',
    description: 'URL de la imagen del producto',
  })
  imageUrl?: string | null;

  @ApiProperty({
    example: true,
    description: 'Indica si el producto está activo',
  })
  isActive: boolean;

  @ApiProperty({
    example: ' Electrónica ',
    description: 'Categoría del producto',
  })
  category: {
    id: string;
    name: string;
  };

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Fecha de creación',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T12:00:00Z',
    description: 'Fecha de actualización',
  })
  updatedAt: Date;
}
