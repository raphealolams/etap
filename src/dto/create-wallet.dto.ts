import { IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  readonly currency: string;
}
