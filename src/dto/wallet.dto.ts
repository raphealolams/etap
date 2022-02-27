import { IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  readonly currency: string;
}

export class FundWalletDto {
  @IsNotEmpty()
  readonly wallet_id: string;

  @IsNotEmpty()
  readonly amount: number;
}

export class FundWalletGeneratePaymentLinkDto {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly amount: number;

  @IsNotEmpty()
  readonly currency: string;

  @IsNotEmpty()
  readonly reference: string;
}
