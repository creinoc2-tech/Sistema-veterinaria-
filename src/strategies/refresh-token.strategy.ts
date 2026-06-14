import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from '../services/prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../utils/jwt/constants.jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareHash } from '../utils/crypto/crypto.utils';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: { headers: { authorization?: string } },
    payload: { sub: string; email: string },
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const refreshToken = authHeader.replace('Bearer ', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        refreshToken: true,
      },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const refreshTokenMatches = await compareHash(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
