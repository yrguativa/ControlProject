import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL', 'http://localhost:3000/api/auth/google/callback'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName } = profile;

    let user = await this.usersService.findByGoogleId(id);

    if (!user) {
      user = await this.usersService.createGoogleUser({
        googleId: id,
        email: emails[0].value,
        name: displayName,
      });
    }

    done(null, user);
  }
}
