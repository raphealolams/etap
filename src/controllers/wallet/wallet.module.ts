import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import WalletController from './wallet.controller';
import WalletService from './wallet.service';
import Wallets from '../../entities/Wallets';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Wallets]), ConfigModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
