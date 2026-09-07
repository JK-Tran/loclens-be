import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface.js';
import type { UserRepository } from '../../../users/domain/repositories/user.repository.interface.js';
import { User } from '../../../users/domain/entities/user.entity.js';
import { Email } from '../../../users/domain/value-objects/email.value-object.js';
import { ApplicationException } from '../../../../core/application/exceptions/application.exception.js';
import { PASSWORD_HASHER } from '../../../../core/application/ports/password-hasher.interface.js';
import type { PasswordHasher } from '../../../../core/application/ports/password-hasher.interface.js';
import { RegisterDto } from '../../presentation/dto/register.dto.js';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    const email = Email.create(dto.email);
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser) {
      throw new ApplicationException('User already exists', 'USER_ALREADY_EXISTS');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const user = User.create(randomUUID(), email, hashedPassword, dto.name || null);
    
    await this.userRepository.save(user);
    
    return user;
  }
}
