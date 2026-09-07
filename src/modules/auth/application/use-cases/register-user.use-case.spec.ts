import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';
import { RegisterUserUseCase } from './register-user.use-case.js';
import { UserRepository } from '../../../users/domain/repositories/user.repository.interface.js';
import { PasswordHasher } from '../../../../core/application/ports/password-hasher.interface.js';
import { RegisterDto } from '../../presentation/dto/register.dto.js';
import { ApplicationException } from '../../../../core/application/exceptions/application.exception.js';
import { User } from '../../../users/domain/entities/user.entity.js';
import { Email } from '../../../users/domain/value-objects/email.value-object.js';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: Mocked<UserRepository>;
  let mockPasswordHasher: Mocked<PasswordHasher>;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
    };
    mockPasswordHasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };
    useCase = new RegisterUserUseCase(mockUserRepository, mockPasswordHasher);
  });

  it('should register a new user successfully', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue('hashed_password123');

    const result = await useCase.execute(dto);

    expect(result).toBeInstanceOf(User);
    expect(result.email.getValue()).toBe(dto.email);
    expect(result.passwordHash).toBe('hashed_password123');
    expect(mockUserRepository.save).toHaveBeenCalledWith(result);
  });

  it('should throw if user already exists', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const existingUser = User.create('id', Email.create(dto.email), 'hash', null);
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(dto)).rejects.toThrow(ApplicationException);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
