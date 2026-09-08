import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface.js';
import { User } from '../../domain/entities/user.entity.js';
import { Email } from '../../domain/value-objects/email.value-object.js';
import { PrismaService } from '../../../../core/infrastructure/database/prisma/prisma.service.js';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!raw) return null;
    return PrismaUserMapper.toDomain(raw);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const raw = await this.prisma.user.findFirst({
      where: { email: email.getValue(), deletedAt: null },
    });
    if (!raw) return null;
    return PrismaUserMapper.toDomain(raw);
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistence(user);
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: data,
    });
  }
}
