
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ user: {sub: number, email: string, name: string}, access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.password !== pass) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      user: payload,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException("O e-mail escolhido ja esta em uso.");
    }
    const user = await this.usersService.create({ email, password, name });
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      user: payload,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
