import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface.js';
import { PrismaUserRepository } from './infrastructure/database/prisma-user.repository.js';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
