export interface CreateWalletStatus {
  id: string;
  currency: string;
  available_balance: number;
  total_balance: number;
  status: string;
}
