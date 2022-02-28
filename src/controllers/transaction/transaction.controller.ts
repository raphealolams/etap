import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import WalletService from './transaction.service';
import { CreateWalletDto, FundWalletDto } from '../../dto/index.dto';
import {
  CreateWalletStatus,
  UserWallets,
  UserWallet,
} from '../../interfaces/index.interface';

@Controller('transaction')
class TransactionController {
  constructor(private readonly walletService: WalletService) {}
}

export default TransactionController;
