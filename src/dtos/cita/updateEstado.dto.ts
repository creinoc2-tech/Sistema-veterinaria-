import { ApiProperty } from '@nestjs/swagger';
import { EstadoCita } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateEstadoCitaDto {
  @ApiProperty({
    description: 'Estado de la cita',
    example: 'PENDIENTE',
  })
  @IsEnum(EstadoCita, { message: 'Invalid role' })
  @IsNotEmpty()
  estado: EstadoCita;
}
