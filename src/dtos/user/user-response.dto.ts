import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  firstname: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  lastname: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
  })
  role: Role;

  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
