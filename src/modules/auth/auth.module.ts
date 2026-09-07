import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { UsersModule } from '../users/users.module.js';
import { PASSWORD_HASHER } from '../../core/application/ports/password-hasher.interface.js';
import { BcryptPasswordHasher } from '../../core/infrastructure/crypto/bcrypt-password.hasher.js';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: configService.get<string>('jwt.accessExpiresIn') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    RegisterUserUseCase,
    LoginUseCase,
    JwtStrategy,
  ],
})
export class AuthModule {}
