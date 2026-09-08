import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy.js';
import { AuthService } from './application/services/auth.service.js';

import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret') || 'secret',
        signOptions: { expiresIn: configService.get<string>('jwt.accessExpiresIn') as any || '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
  ],
})
export class AuthModule {}
