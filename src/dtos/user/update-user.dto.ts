import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  email: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
  })
  @IsEnum(Role, { message: 'Invalid role' })
  @IsOptional({ message: 'Role is optional' })
  role: Role;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
