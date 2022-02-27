import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

import Users from '../../entities/Users';
import Wallets, { Status } from 'src/entities/Wallets';
import Transactions, { TransactionStatus } from '../../entities/Transactions';

import {
  CreateWalletDto,
  FundWalletDto,
  FundWalletGeneratePaymentLinkDto,
} from '../../dto/index.dto';
import {
  UserWallets,
  UserWallet,
  CreateWalletStatus,
  WalletId,
} from '../../interfaces/index.interface';

import { generateReference } from 'src/utils';

@Injectable()
class WalletService {
  constructor(
    @InjectRepository(Wallets)
    @InjectRepository(Transactions)
    private readonly walletRepository: Repository<Wallets>,
    private readonly transactionRepository: Repository<Transactions>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    return wallet;
  }

  protected __handleOk(resp: any) {
    return of(resp.data?.data);
  }

  protected async __createTransactionHistory({
    amount,
    wallet,
    user,
    reference,
    status,
  }): Promise<void> {
    const transaction = await this.transactionRepository.create({
      amount,
      wallet,
      user,
      reference,
      status,
    });

    await this.transactionRepository.save(transaction);
  }

  protected __handleError(error: AxiosError) {
    // throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    return throwError({
      code: error.code,
      timestamp: new Date().toLocaleDateString(),
      path: error.config?.url,
      method: error.config?.method,
      message: error.message || 'Internal server error',
    });
  }

  __generatePaymentLinkWithPaystack({
    email,
    amount,
    currency,
    reference,
  }: FundWalletGeneratePaymentLinkDto): Observable<any> {
    const body = {
      email,
      amount: amount * 100,
      currency,
      reference,
      callback_url: this.configService.get('PAYSTACK_CALLBACK_URL'),
    };
    const headers = {
      Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
    };
    const url = `${this.configService.get(
      'PAYSTACK_URL',
    )}/transaction/initialize`;

    return this.httpService
      .post(url, body, {
        headers,
      })
      .pipe(catchError(this.__handleError), switchMap(this.__handleOk));
  }

  async fundWallet(
    { wallet_id, amount }: FundWalletDto,
    user: Users,
  ): Promise<any> {
    const wallet = await this.walletRepository.findOne({
      where: { id: wallet_id, user, is_active: true, status: Status.ACTIVE },
      relations: ['user'],
    });

    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    const reference = generateReference();
    this.__createTransactionHistory({
      amount,
      wallet,
      user: wallet.user,
      reference,
      status: TransactionStatus.PENDING,
    });
    const paymentResponse = this.__generatePaymentLinkWithPaystack({
      currency: wallet.currency,
      email: wallet.user.email,
      amount,
      reference,
    });
    return paymentResponse;
  }

  // async verifyTransferAndCreditUser() {}
}

export default WalletService;
