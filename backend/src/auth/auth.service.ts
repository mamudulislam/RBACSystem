import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(email: string, pass: string, fullName: string) {
    const hashedPassword = await argon2.hash(pass);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'CUSTOMER',
      },
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user && await argon2.verify(user.password, pass)) {
      if (user.isBanned || user.isSuspended || !user.isActive) {
        throw new UnauthorizedException('User account is inactive, suspended, or banned');
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token to DB for blacklisting/persistence
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const permissions = await this.getUserPermissions(user.id, user.role);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        permissions,
      },
    };
  }

  async getUserPermissions(userId: string, role: string): Promise<string[]> {
    const rolePerms = await this.prisma.rolePermission.findMany({
      where: { role: role as any },
      include: { permission: true },
    });
    let permsSet = new Set(rolePerms.map(rp => rp.permission.atom));

    const userPerms = await this.prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });

    for (const up of userPerms) {
      if (up.granted) permsSet.add(up.permission.atom);
      else permsSet.delete(up.permission.atom);
    }

    return Array.from(permsSet) as string[];
  }

  async refreshToken(token: string) {
    try {
      // Check if token exists in DB and is not expired
      const dbToken = await this.prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!dbToken || dbToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired or invalid');
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = dbToken.user;
      const newAccessToken = this.jwtService.sign({ 
        email: user.email, 
        sub: user.id, 
        role: user.role 
      });

      const permissions = await this.getUserPermissions(user.id, user.role);

      return {
        access_token: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          permissions,
        },
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async revokeToken(token: string) {
    try {
      await this.prisma.refreshToken.delete({ where: { token } });
    } catch (e) {
      // Token might not exist, ignore
    }
  }

  generateRefreshToken(user: any) {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }
}
