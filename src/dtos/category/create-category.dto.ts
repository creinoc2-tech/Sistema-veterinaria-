import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Devices and gadgets',
    description: 'A brief description of the category',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  descripcion?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the category is active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
