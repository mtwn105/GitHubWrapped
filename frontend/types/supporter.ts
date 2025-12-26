export interface Supporter {
  paymentId: string;
  name: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface SupportersResponse {
  supporters: Supporter[];
  totalCount: number;
  totalAmount: number;
}

