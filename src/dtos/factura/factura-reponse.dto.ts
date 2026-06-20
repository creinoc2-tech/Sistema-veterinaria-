import { ApiProperty } from '@nestjs/swagger';
import { EstadoPago, MetodoPago } from '@prisma/client';

export class FacturaResponseDto {
  @ApiProperty({ example: 'uuid123' })
  id: string;

  @ApiProperty({ example: 'cm123abc' })
  numero: string;

  @ApiProperty({ example: 40.48, description: 'Suma de todos los productos' })
  subtotal: number;

  @ApiProperty({ example: 6.07, description: 'IVA (15%)' })
  iva: number;

  @ApiProperty({ example: 46.55, description: 'Subtotal + IVA' })
  total: number;

  @ApiProperty({ enum: MetodoPago, example: 'EFECTIVO' })
  metodoPago: MetodoPago;

  @ApiProperty({ enum: EstadoPago, example: 'PENDIENTE' })
  estadoPago: EstadoPago;

  @ApiProperty({
    example: {
      id: 'cuid123',
      email: 'cliente@email.com',
      firstname: 'Juan',
      lastname: 'Pérez',
    },
  })
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };

  @ApiProperty({
    example: {
      id: 'cuid-cita',
      fecha: '2026-06-25T10:00:00.000Z',
      motivo: 'Revisión general',
      tipo: 'CONSULTA',
    },
  })
  cita: {
    id: string;
    fecha: Date;
    motivo: string;
    tipo: string;
  };

  @ApiProperty({
    description: 'Productos facturados',
    example: [
      {
        id: 'uuid-item',
        product: {
          id: 'uuid-producto',
          name: 'Amoxicilina 500mg',
          sku: 'AMOX-500',
        },
        cantidad: 2,
        precio: 15.99,
        subtotal: 31.98,
      },
    ],
  })
  items: {
    id: string;
    product: { id: string; name: string; sku: string };
    cantidad: number;
    precio: number;
    subtotal: number;
  }[];

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-02T12:00:00Z' })
  updatedAt: Date;
}
