// create-factura.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { EstadoPago, MetodoPago } from '@prisma/client';

export class FacturaItemDto {
  @ApiProperty({
    example: 'uuid-del-producto',
    description: 'ID del producto',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Cantidad del producto',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class CreateFacturaDto {
  @ApiProperty({
    example: 'cuid-de-la-cita',
    description: 'ID de la cita que genera la factura',
  })
  @IsString()
  @IsNotEmpty()
  citaId: string;

  @ApiProperty({
    enum: MetodoPago,
    example: 'EFECTIVO',
    description: 'Método de pago',
  })
  @IsEnum(MetodoPago)
  @IsNotEmpty()
  metodoPago: MetodoPago;

  @ApiProperty({
    enum: EstadoPago,
    example: 'PENDIENTE',
    description: 'Estado del pago',
  })
  @IsEnum(EstadoPago)
  @IsOptional()
  estadoPago: EstadoPago;

  @ApiProperty({
    type: [FacturaItemDto],
    description: 'Productos utilizados en la consulta',
    example: [
      { productId: 'uuid-producto-1', cantidad: 2 },
      { productId: 'uuid-producto-2', cantidad: 1 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FacturaItemDto)
  items: FacturaItemDto[];
}
