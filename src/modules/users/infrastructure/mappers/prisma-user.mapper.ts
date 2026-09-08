import { User as PrismaUser } from '@prisma/client';
import { User } from '../../domain/entities/user.entity.js';
import { Email } from '../../domain/value-objects/email.value-object.js';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return new User(
      raw.id,
      Email.create(raw.email),
      raw.fullName,
      raw.avatarUrl,
      raw.bio,
      raw.trustScore,
      raw.totalReviews,
      raw.passwordHash,
      raw.refreshToken,
      raw.googleId,
      raw.deletedAt,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.id,
      email: user.email.getValue(),
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      trustScore: user.trustScore,
      totalReviews: user.totalReviews,
      passwordHash: user.passwordHash,
      refreshToken: user.refreshToken,
      googleId: user.googleId,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
