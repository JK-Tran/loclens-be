import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface.js';
import type { UserRepository } from '../../../users/domain/repositories/user.repository.interface.js';
import { Email } from '../../../users/domain/value-objects/email.value-object.js';
import { ApplicationException } from '../../../../core/application/exceptions/application.exception.js';
import { PASSWORD_HASHER } from '../../../../core/application/ports/password-hasher.interface.js';
import type { PasswordHasher } from '../../../../core/application/ports/password-hasher.interface.js';
import { LoginDto } from '../../presentation/dto/login.dto.js';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const email = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new ApplicationException('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApplicationException('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const payload = { sub: user.id, email: user.email.getValue() };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '7d' })
    ]);

    return { accessToken, refreshToken };
  }
}
