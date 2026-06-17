import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Especie, Sexo } from '@prisma/client';

export class MascotaResponseDto {
  @ApiProperty({
    example: 'cuid123',
    description: 'ID de la mascota',
  })
  id: string;

  @ApiProperty({
    example: 'Firulais',
    description: 'Nombre de la mascota',
  })
  name: string;

  @ApiProperty({
    enum: Especie,
    example: 'PERRO',
    description: 'Especie de la mascota',
  })
  especie: Especie;

  @ApiPropertyOptional({
    example: 'Labrador',
    description: 'Raza de la mascota',
  })
  raza?: string | null;

  @ApiProperty({
    enum: Sexo,
    example: 'MACHO',
    description: 'Sexo de la mascota',
  })
  sexo: Sexo;

  @ApiPropertyOptional({
    example: '2020-01-01',
    description: 'Fecha de nacimiento de la mascota',
  })
  fechaNac?: Date | null;

  @ApiPropertyOptional({
    example: 10.5,
    description: 'Peso de la mascota en kg',
  })
  peso?: number | null;

  @ApiPropertyOptional({
    example: 'Marrón con blanco',
    description: 'Color de la mascota',
  })
  color?: string | null;

  @ApiPropertyOptional({
    example: 'https://imagen.com/mascota.jpg',
    description: 'URL de la imagen de la mascota',
  })
  foto?: string | null;

  @ApiProperty({
    description: 'Datos del dueño de la mascota',
    example: {
      id: 'cuid123',
      email: 'dueno@email.com',
      firstname: 'Juan',
      lastname: 'Pérez',
    },
  })
  duenoId: {
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
