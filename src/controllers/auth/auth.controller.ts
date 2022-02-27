import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import AuthService from './auth.service';
import { LoginDto, RegisterDto } from '../../dto/index.dto';
import { LoginStatus } from '../../interfaces/index.interface';

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  public async login(@Body() loginUserDto: LoginDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Post('signup')
  public async register(
    @Body() registerDto: RegisterDto,
  ): Promise<LoginStatus> {
    return await this.authService.registerAndGenerateToken(registerDto);
  }

  @Get('me')
  @UseGuards(AuthGuard())
  public async me(@Req() req: any): Promise<any> {
    return await this.authService.me(req.user);
  }
}

export default AuthController;
