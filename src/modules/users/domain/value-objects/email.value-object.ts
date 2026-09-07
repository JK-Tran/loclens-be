import { DomainException } from '../../../../core/domain/exceptions/domain.exception.js';

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(email: string): Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new DomainException('Invalid email format', 'INVALID_EMAIL');
    }
    return new Email(email.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }
}
