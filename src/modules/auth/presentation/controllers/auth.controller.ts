import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { RegisterDto } from '../dto/register.dto.js';
import { LoginDto } from '../dto/login.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email.getValue(),
        name: user.name,
        createdAt: user.createdAt,
      },
      meta: null,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get tokens' })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  async login(@Body() dto: LoginDto) {
    const tokens = await this.loginUseCase.execute(dto);
    return {
      success: true,
      data: tokens,
      meta: null,
    };
  }
}
