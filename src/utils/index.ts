import * as bcrypt from 'bcrypt';
import Users from '../entities/Users';
import { UserDto } from '../dto/index.dto';
export const transformUserEntityToDto = (data: Users): UserDto => {
  const {
    id,
    phone_number,
    email,
    first_name,
    middle_name,
    last_name,
    wallets,
  } = data;

  const userDto: UserDto = {
    id,
    first_name,
    middle_name,
    last_name,
    phone_number,
    email,
    wallets,
  };

  return userDto;
};

export const comparePassword = (plainPassword, hashPassword): boolean => {
  return bcrypt.compareSync(plainPassword, hashPassword);
};

export const generateReference = (limit = 10): any =>
  Number(`${Date.now().toString().slice(0, limit)}`);
