import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  readonly phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly first_name: string;

  @IsNotEmpty()
  readonly last_name: string;

  @IsNotEmpty()
  readonly middle_name?: string;

  @IsNotEmpty()
  readonly password: string;
}
