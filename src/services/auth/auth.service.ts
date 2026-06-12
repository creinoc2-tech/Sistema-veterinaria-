import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { compareHash, generateHash } from '../../utils/crypto/crypto.utils';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { LoginDto } from '../../dtos/auth/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstname, lastname } = registerDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    try {
      const hashedPassword = await generateHash(password);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstname,
          lastname,
        },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: true,
          password: false,
        },
      });

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.udateRefreshToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user,
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new InternalServerErrorException(
        'An error occurred during registration',
      );
    }
  }

  async refreshTokens(userId: string): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
      },
    });

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.udateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      throw new InternalServerErrorException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.udateRefreshToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, role };
    const refreshId = randomBytes(16).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync({ ...payload, refreshId }, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  private async udateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: refreshToken },
    });
  }
}
