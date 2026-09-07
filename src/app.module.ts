import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { validate } from './config/env.schema.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { PrismaModule } from './core/infrastructure/database/prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
