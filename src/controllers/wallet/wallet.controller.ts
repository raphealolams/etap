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

import WalletService from './wallet.service';
import { CreateWalletDto, FundWalletDto } from '../../dto/index.dto';
import {
  CreateWalletStatus,
  UserWallets,
  UserWallet,
} from '../../interfaces/index.interface';

@Controller('wallets')
class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  public async findAll(@Req() req: any): Promise<UserWallets> {
    return await this.walletService.findWallets(req.user);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  public async create(
    @Req() req: any,
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<CreateWalletStatus> {
    return await this.walletService.create(createWalletDto, req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public async findOne(
    @Req() req: any,
    @Param() params: any,
  ): Promise<UserWallet> {
    return await this.walletService.findWallet(params.id, req.user);
  }
  @HttpCode(200)
  @Post('/fund-wallet')
  @UseGuards(AuthGuard('jwt'))
  public async fundWallet(
    @Req() req: any,
    @Body() fundWalletDto: FundWalletDto,
  ) {
    return await this.walletService.fundWallet(fundWalletDto, req.user);
  }

  @HttpCode(200)
  @Post('/webhook')
  public async callBack(@Req() req: any, @Body() body: any) {
    // return await this.walletService.verifyTransferAndCreditUser(body);
  }
}

export default WalletController;
