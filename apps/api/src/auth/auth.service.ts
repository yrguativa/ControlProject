import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserInput, LoginInput } from '../users/dto/user.dto';
import { AuthPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(input: CreateUserInput): Promise<AuthPayload> {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) throw new UnauthorizedException('Email already registered');

    const user = await this.usersService.create(input);
    return this.generateTokens(user);
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.usersService.validatePassword(input.email, input.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.active) throw new UnauthorizedException('Tu cuenta esta desactivada. Contacta al administrador.');

    return this.generateTokens(user);
  }

  async googleLogin(user: any): Promise<AuthPayload> {
    return this.generateTokens(user);
  }

  async refreshToken(token: string): Promise<AuthPayload> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'refresh-secret-key'),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private extractPermissions(user: any): string[] {
    const role = user.role;
    if (!role) return [];

    const perms = role.permissions;
    if (!perms) return [];

    return perms.map((p: any) => typeof p === 'string' ? p : p.key).filter(Boolean);
  }

  private generateTokens(user: any): AuthPayload {
    const roleName = typeof user.role === 'string' ? user.role : user.role?.name;
    const permissions = this.extractPermissions(user);

    const payload = {
      sub: user._id,
      email: user.email,
      role: roleName,
      permissions,
      approved: user.approved,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get<string>('JWT_SECRET', 'controlproject-secret-key'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.config.get<string>('JWT_REFRESH_SECRET', 'refresh-secret-key'),
    });

    return {
      accessToken,
      refreshToken,
      userId: user._id,
      email: user.email,
      name: user.name,
      role: roleName,
      permissions,
      approved: user.approved,
    };
  }
}
