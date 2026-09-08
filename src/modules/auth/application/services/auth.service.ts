import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface.js';
import type { UserRepository } from '../../../users/domain/repositories/user.repository.interface.js';
import { User } from '../../../users/domain/entities/user.entity.js';
import { Email } from '../../../users/domain/value-objects/email.value-object.js';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    // In a real app, inject client ID from ConfigService
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async register(registerDto: any) {
    const { email, password, fullName } = registerDto;
    
    const emailVO = Email.create(email);
    const existingUser = await this.userRepository.findByEmail(emailVO);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = User.create(
      randomUUID(),
      emailVO,
      fullName,
      null,
      null,
      100,
      0,
      passwordHash
    );

    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  async login(loginDto: any) {
    const { email, password } = loginDto;
    
    const user = await this.userRepository.findByEmail(Email.create(email));
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async googleLogin(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
         throw new UnauthorizedException('Invalid Google token');
      }

      const emailVO = Email.create(payload.email);
      let user = await this.userRepository.findByEmail(emailVO);

      if (!user) {
        // Create a new user since one doesn't exist
        user = User.create(
          randomUUID(),
          emailVO,
          payload.name || 'Google User',
          payload.picture || null,
          null,
          100,
          0,
          null, // No password initially
          null,
          payload.sub // Google ID
        );
      } else if (!user.googleId) {
        // Link google account to existing user
        user.googleId = payload.sub;
      }
      
      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Very basic refresh logic
      // In production, also verify signature of refreshToken if it is a JWT
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret' });
      const user = await this.userRepository.findById(payload.sub);
      
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email.getValue() };
    
    const accessToken = this.jwtService.sign(payload); // Uses default config in JwtModule
    
    // Create refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: '7d',
    });

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email.getValue(),
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        hasPassword: !!user.passwordHash
      }
    };
  }
}
