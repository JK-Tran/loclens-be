import { User as PrismaUser } from '@prisma/client';
import { User } from '../../domain/entities/user.entity.js';
import { Email } from '../../domain/value-objects/email.value-object.js';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return new User(
      raw.id,
      Email.create(raw.email),
      raw.passwordHash,
      raw.name,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.id,
      email: user.email.getValue(),
      passwordHash: user.passwordHash,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
