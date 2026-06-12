import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token for authenticating API requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
  @ApiProperty({
    description: 'User information',
    example: {
      id: '1',
      email: 'user@example.com',
      firstname: 'John',
      lastname: 'Doe',
      role: 'USER',
    },
  })
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: Role;
  };
}
