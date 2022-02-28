import { IsNotEmpty } from 'class-validator';
import Users from 'src/entities/Users';
import Wallets from 'src/entities/Wallets';
import { TransactionStatus } from 'src/entities/Transactions';

export class verifyTransaction {
  @IsNotEmpty()
  readonly reference: string;

  @IsNotEmpty()
  readonly status: TransactionStatus;

  @IsNotEmpty()
  readonly user: Users;

  @IsNotEmpty()
  readonly wallet: Wallets;
}
