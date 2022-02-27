interface __Wallet {
  id: string;
  currency: string;
  available_balance: number;
  total_balance: number;
  status: string;
}
interface __Id {
  id: string;
}

export type UserWallets = Array<__Wallet>;

export type UserWallet = __Wallet;

export type WalletId = __Id;
