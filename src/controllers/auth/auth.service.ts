import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import Users from '../../entities/Users';

import { LoginDto, UserDto, RegisterDto } from '../../dto/index.dto';
import { JwtPayload, LoginStatus } from '../../interfaces/index.interface';
import { transformUserEntityToDto, comparePassword } from '../../utils/index';

@Injectable()
class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async __findAndLogin({
    phone_number,
    password,
  }: LoginDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { phone_number } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // compare passwords
    const validPassword = comparePassword(password, user.password);

    if (!validPassword) {
      throw new HttpException(
        'Invalid phone number/password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return transformUserEntityToDto(user);
  }

  private async __findById({ id }: any): Promise<UserDto> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async login(payload: LoginDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.__findAndLogin(payload);

    // generate and sign token
    const token = this.__generateToken(user);

    return {
      ...user,
      ...token,
    };
  }

  async me({ id }: JwtPayload): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return transformUserEntityToDto(user);
  }

  async registerAndGenerateToken({
    phone_number,
    first_name,
    last_name,
    email,
    middle_name,
    password,
  }: RegisterDto): Promise<LoginStatus> {
    const existing = await this.userRepository.findOne({ phone_number });

    if (existing) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: Users = await this.userRepository.create({
      phone_number,
      first_name,
      last_name,
      email,
      middle_name,
      password,
    });

    await this.userRepository.save(user);
    const token = this.__generateToken(user);
    return {
      ...transformUserEntityToDto(user),
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.__findById(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private __generateToken({ id }: UserDto): any {
    const user: JwtPayload = { id };
    return {
      expires_in: this.configService.get('JWT_EXPIRES_IN'),
      access_token: this.jwtService.sign(user),
    };
  }
}

export default AuthService;
