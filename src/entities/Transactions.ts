import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Users from './Users';
import Wallets from './Wallets';
import { ColumnNumericTransformer } from './utils';

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

@Entity({ name: 'transactions' })
class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    // precision: 2,
    // scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PROCESSING,
  })
  status: TransactionStatus;

  @Column({ length: 266, nullable: false, unique: true })
  reference: string;

  @ManyToOne(() => Users, (user: Users) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Wallets, (wallet: Wallets) => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallets;

  @Column({
    type: 'json',
    default: {},
  })
  api_log: any;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  modified_at: Date;
}

export default Transactions;
