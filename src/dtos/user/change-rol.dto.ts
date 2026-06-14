import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ChangeRoleDto {
  @ApiProperty({
    description: 'User role',
    example: 'USER',
  })
  @IsEnum(Role, { message: 'Invalid role' })
  @IsOptional({ message: 'Role is optional' })
  role: Role;
}
