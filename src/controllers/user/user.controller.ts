import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guard/user/jwt-auth.guard';
import { RoleGuard } from '../../guard/user/role.guard';
import { UserService } from '../../services/user/user.service';
import { GetUser } from '../../decorators/get-user.decorator';
import { UserResponseDto } from '../../dtos/user/user-response.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
import { ChangePasswordDto } from '../../dtos/user/change-password.dto';
import { ChangeRoleDto } from '../../dtos/user/change-rol.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'The current user profile',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@GetUser('id') userId: string): Promise<UserResponseDto> {
    console.log('Received request to fetch profile for user ID:', userId);
    console.log('Fetching profile for user ID:', userId);
    return this.userService.getUserById(userId);
  }

  @Roles(Role.ADMIN)
  @Get('user/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user profile',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') userId: string): Promise<UserResponseDto> {
    return this.userService.getUserById(userId);
  }

  @Roles(Role.ADMIN)
  @Get('/list')
  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No users found' })
  async getAll(): Promise<UserResponseDto[]> {
    return this.userService.getAll();
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(userId, changePasswordDto);
  }

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete('user/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteAccount(
    @Param('id') userId: string,
  ): Promise<{ message: string }> {
    await this.userService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }

  @Delete('me/:id')
  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    await this.userService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }

  @Roles(Role.ADMIN)
  @Patch('new/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user role' })
  @ApiResponse({ status: 200, description: 'Role changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateRole(
    @GetUser('id') userId: string,
    @Body() changeRoleDto: ChangeRoleDto,
  ): Promise<{ message: string }> {
    return this.userService.changeRole(userId, changeRoleDto.role);
  }
}
