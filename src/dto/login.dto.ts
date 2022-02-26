import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  readonly phone_number: string;

  @IsNotEmpty()
  readonly password: string;
}
