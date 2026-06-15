import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    example: 'Devices and gadgets',
    description: 'A brief description of the category',
    maxLength: 255,
  })
  descripcion?: string | null;

  @ApiProperty({
    example: 'electronics',
    description: 'The slug of the category',
    maxLength: 100,
  })
  slug: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the category is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: 150,
    description: 'Number of products in this category',
  })
  productCount: number;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'The date and time when the category was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T12:00:00Z',
    description: 'The date and time when the category was last updated',
  })
  updatedAt: Date;
}
