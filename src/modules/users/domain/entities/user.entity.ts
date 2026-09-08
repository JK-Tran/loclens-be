import { BaseEntity } from '../../../../core/domain/base.entity.js';
import { Email } from '../value-objects/email.value-object.js';

export class User extends BaseEntity<string> {
  private _email: Email;
  private _fullName: string;
  private _avatarUrl: string | null;
  private _bio: string | null;
  private _trustScore: number;
  private _totalReviews: number;
  private _passwordHash: string | null;
  private _refreshToken: string | null;
  private _googleId: string | null;
  private _deletedAt: Date | null;

  constructor(
    id: string,
    email: Email,
    fullName: string,
    avatarUrl: string | null = null,
    bio: string | null = null,
    trustScore: number = 100,
    totalReviews: number = 0,
    passwordHash: string | null = null,
    refreshToken: string | null = null,
    googleId: string | null = null,
    deletedAt: Date | null = null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._email = email;
    this._fullName = fullName;
    this._avatarUrl = avatarUrl;
    this._bio = bio;
    this._trustScore = trustScore;
    this._totalReviews = totalReviews;
    this._passwordHash = passwordHash;
    this._refreshToken = refreshToken;
    this._googleId = googleId;
    this._deletedAt = deletedAt;
  }

  static create(
    id: string,
    email: Email,
    fullName: string,
    avatarUrl: string | null = null,
    bio: string | null = null,
    trustScore: number = 100,
    totalReviews: number = 0,
    passwordHash: string | null = null,
    refreshToken: string | null = null,
    googleId: string | null = null,
  ): User {
    return new User(id, email, fullName, avatarUrl, bio, trustScore, totalReviews, passwordHash, refreshToken, googleId);
  }

  get email(): Email {
    return this._email;
  }

  get fullName(): string {
    return this._fullName;
  }

  get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  get bio(): string | null {
    return this._bio;
  }

  get trustScore(): number {
    return this._trustScore;
  }

  get totalReviews(): number {
    return this._totalReviews;
  }

  get passwordHash(): string | null {
    return this._passwordHash;
  }

  get refreshToken(): string | null {
    return this._refreshToken;
  }

  get googleId(): string | null {
    return this._googleId;
  }

  set passwordHash(hash: string | null) {
    this._passwordHash = hash;
  }

  set refreshToken(token: string | null) {
    this._refreshToken = token;
  }

  set googleId(id: string | null) {
    this._googleId = id;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  delete(): void {
    this._deletedAt = new Date();
  }
}
