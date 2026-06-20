import { ApiProperty } from '@nestjs/swagger';
import { EstadoPago } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateEstadoFacturaDto {
  @ApiProperty({
    description: ' Estado de la factura',
    example: 'PENDIENTE',
  })
  @IsEnum(EstadoPago, { message: 'Invalid role' })
  @IsNotEmpty()
  estadoPago: EstadoPago;
}
