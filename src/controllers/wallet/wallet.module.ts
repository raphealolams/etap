import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import WalletController from './wallet.controller';
import WalletService from './wallet.service';
import Wallets from '../../entities/Wallets';
import Transactions from '../../entities/Wallets';
@Module({
  imports: [
    TypeOrmModule.forFeature([Wallets, Transactions]),
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
      }),
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
