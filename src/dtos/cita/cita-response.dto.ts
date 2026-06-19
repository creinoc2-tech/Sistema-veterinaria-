import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoCita, Sexo, TipoCita } from '@prisma/client';
export class CitaResponseDto {
  @ApiProperty({
    example: 'cuid123',
    description: 'ID de la mascota',
  })
  id: string;

  @ApiPropertyOptional({
    example: '2020-01-01',
    description: 'Fecha de nacimiento de la mascota',
  })
  fecha?: Date | null;

  @ApiProperty({
    example: '14:30',
    description: 'Hora de la cita',
    type: 'string', // ← agregar esto
  })
  hora?: string;

  @ApiProperty({
    example: 'Consulta general',
    description: 'Motivo de la cita',
    maxLength: 255,
  })
  motivo?: string;

  @ApiProperty({
    description: 'Estado de la cita',
    example: 'PENDIENTE',
  })
  estado: EstadoCita;

  @ApiProperty({
    description: 'Tipo de la cita',
    example: 'CONSULTA',
  })
  tipo: TipoCita;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Traer resultados de laboratorio',
    maxLength: 255,
  })
  notas?: string;

  @ApiPropertyOptional({
    description: 'ID de la mascota (solo ADMIN/RECEPCIONISTA)',
    example: {
      id: 'cuid123',
      name: 'Firulais',
      raza: 'Labrador',
      sexo: 'MACHO',
    },
  })
  mascotaId: {
    id: string;
    name: string;
    raza: string | null;
    sexo: Sexo;
    dueno?: {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
    };
  };

  @ApiPropertyOptional({
    description: 'ID del veterinario (solo ADMIN/RECEPCIONISTA)',
    example: {
      id: 'cuid123',
      email: 'dueno@email.com',
      firstname: 'Juan',
      lastname: 'Pérez',
    },
  })
  veterinarioId: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };

  @ApiPropertyOptional({
    description: 'ID del usuario que creó la cita (solo ADMIN/RECEPCIONISTA)',
    example: {
      id: 'cuid123',
      email: 'dueno@email.com',
      firstname: 'Juan',
      lastname: 'Pérez',
    },
  })
  creadoPorId: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };

  @ApiPropertyOptional({
    description:
      ' Datos del cliente que creó la cita (solo ADMIN/RECEPCIONISTA) - incluye id, email, firstname y lastname',
    example: {
      id: 'cuid123',
      email: 'dueno@email.com',
      firstname: 'Juan',
      lastname: 'Pérez',
    },
  })
  clienteId?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
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
