import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 266 })
  first_name: string;

  @Column({ length: 266, nullable: true })
  last_name: string | null;

  @Column({ length: 266, nullable: true })
  middle_name: string | null;

  @Column({ length: 266, nullable: false, unique: true })
  phone_number: string;

  @Column({ length: 266, nullable: false, unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  modified_at: Date;

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}

export default Users;
