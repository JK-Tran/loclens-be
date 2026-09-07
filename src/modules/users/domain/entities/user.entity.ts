import { BaseEntity } from '../../../../core/domain/base.entity.js';
import { Email } from '../value-objects/email.value-object.js';

export class User extends BaseEntity<string> {
  private _email: Email;
  private _passwordHash: string;
  private _name: string | null;

  constructor(
    id: string,
    email: Email,
    passwordHash: string,
    name: string | null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._email = email;
    this._passwordHash = passwordHash;
    this._name = name;
  }

  static create(
    id: string,
    email: Email,
    passwordHash: string,
    name: string | null,
  ): User {
    return new User(id, email, passwordHash, name);
  }

  get email(): Email {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get name(): string | null {
    return this._name;
  }
}
