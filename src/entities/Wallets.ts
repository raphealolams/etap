import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Users from './Users';
import Transactions from './Transactions';
import { ColumnNumericTransformer } from './utils';

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}
@Entity({ name: 'wallets' })
class Wallets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 3 })
  currency: string;

  @Column({
    type: 'decimal',
    // precision: 2,
    // scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  available_balance: number;

  @Column({
    type: 'decimal',
    // precision: 2,
    // scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  total_balance: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @OneToMany(
    () => Transactions,
    (transaction: Transactions) => transaction.user,
  )
  transactions: Transactions[];

  @ManyToOne(() => Users, (user: Users) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  modified_at: Date;
}

export default Wallets;
