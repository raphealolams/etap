import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import AuthService from './auth.service';
import { LoginDto } from '../../dto/index.dto';
import { LoginStatus } from '../../interfaces/index.interface';

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() loginUserDto: LoginDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  // @Get('me')
  // @UseGuards(AuthGuard())
  // public async testAuth(@Req() req: any): Promise<JwtPayload> {
  //   return req.user;
  // }
}

export default AuthController;
