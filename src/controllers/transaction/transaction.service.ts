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
  FundWalletGeneratePaymentLinkDto,
  verifyTransaction,
} from '../../dto/index.dto';
import {
  UserWallets,
  UserWallet,
  CreateWalletStatus,
  WalletId,
} from '../../interfaces/index.interface';

import { generateReference } from 'src/utils';

@Injectable()
class TransactionService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  protected __handleOk(resp: any) {
    return of(resp.data?.data);
  }

  async __createTransactionHistory({
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

  __verifyFunding({
    reference,
  }: FundWalletGeneratePaymentLinkDto): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
    };
    const url = `${this.configService.get(
      'PAYSTACK_URL',
    )}/transaction/verify/${reference}`;

    return this.httpService
      .get(url, {
        headers,
      })
      .pipe(catchError(this.__handleError), switchMap(this.__handleOk));
  }

  async updateTransactionStatus({
    status,
    user,
    wallet,
    reference,
  }: verifyTransaction) {
    await this.transactionRepository.update(
      { reference },
      { status, user, wallet },
    );
  }

  async __findByReference() {
    const wallet = await this.transactionRepository.findOne({
      where: { id: reference, user, is_active: true, status: Status.ACTIVE },
      relations: ['user'],
    });
  }
}

export default TransactionService;
