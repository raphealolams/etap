import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Users from '../../entities/Users';
import Wallets, { Status } from 'src/entities/Wallets';

import {
  LoginDto,
  UserDto,
  RegisterDto,
  CreateWalletDto,
} from '../../dto/index.dto';
import {
  UserWallets,
  UserWallet,
  CreateWalletStatus,
  WalletId,
} from '../../interfaces/index.interface';

@Injectable()
class WalletService {
  constructor(
    @InjectRepository(Wallets)
    private readonly walletRepository: Repository<Wallets>,
    private readonly configService: ConfigService,
  ) {}

  async create(
    { currency }: CreateWalletDto,
    user: Users,
  ): Promise<CreateWalletStatus> {
    const existing = await this.walletRepository.findOne({
      where: { currency, user },
    });

    if (existing) {
      throw new HttpException('Wallet Already exist', HttpStatus.BAD_REQUEST);
    }
    const wallet = await this.walletRepository.create({
      currency,
      user,
      status: Status.ACTIVE,
    });

    await this.walletRepository.save(wallet);
    return {
      ...wallet,
    };
  }

  async findWallets(user: Users): Promise<UserWallets> {
    const wallets = await this.walletRepository.find({
      where: { user, is_active: true, status: Status.ACTIVE },
    });

    if (!wallets) {
      throw new HttpException('Wallets not found', HttpStatus.NOT_FOUND);
    }

    return wallets;
  }

  async findWallet(id: WalletId, user: Users): Promise<UserWallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id, user, is_active: true, status: Status.ACTIVE },
    });

    if (!wallet) {
      throw new HttpException('Wallets not found', HttpStatus.NOT_FOUND);
    }

    return wallet;
  }
}

export default WalletService;
