import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from '../../dtos/user/user-response.dto';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
import { compareHash, generateHash } from '../../utils/crypto/crypto.utils';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return user;
  }

  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!users || users.length === 0) {
      throw new InternalServerErrorException('No users found');
    }
    return users;
  }

  async updateUser(
    userId: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new InternalServerErrorException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailTaken) {
        throw new InternalServerErrorException('Email is already taken');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    return updatedUser;
  }

  async changePassword(
    userId: string,
    changePasswordDto: { currentPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new InternalServerErrorException('User not found');
    }

    const passwordMatches = await compareHash(
      changePasswordDto.currentPassword,
      existingUser.password,
    );
    if (!passwordMatches) {
      throw new InternalServerErrorException('Current password is incorrect');
    }

    const isSamePassword = await compareHash(
      changePasswordDto.newPassword,
      existingUser.password,
    );
    if (isSamePassword) {
      throw new InternalServerErrorException(
        'New password cannot be the same as the current password',
      );
    }

    const hashedNewPassword = await generateHash(changePasswordDto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new InternalServerErrorException('User not found');
    }
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'User deleted successfully' };
  }

  async changeRole(userId: string, newRole: any): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new InternalServerErrorException('User not found');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    return { message: 'User role updated successfully' };
  }
}
