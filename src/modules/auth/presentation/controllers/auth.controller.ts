import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service.js';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('google')
  async googleLogin(@Body('token') token: string) {
    return this.authService.googleLogin(token);
  }

  @Post('refresh')
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    // req.user is populated by JwtStrategy
    return req.user;
  }
}
