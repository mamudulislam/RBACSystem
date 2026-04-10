import { Controller, Post, Body, Res, Req, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.fullName);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(req.user);
    
    // Set refresh token in httpOnly cookie
    const refreshToken = this.authService.generateRefreshToken(req.user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Set permission data in a session cookie for middleware
    res.cookie('session_data', JSON.stringify({
      permissions: result.user.permissions,
      role: result.user.role
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];
    if (token) {
      await this.authService.revokeToken(token);
    }
    res.clearCookie('refresh_token');
    res.clearCookie('session_data');
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];
    if (!token) throw new UnauthorizedException();
    const result = await this.authService.refreshToken(token);

    // Update permission data in session cookie
    res.cookie('session_data', JSON.stringify({
      permissions: result.user.permissions,
      role: result.user.role
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }
}
