export interface OrderUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface Order {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  totalAmount: number;
  remainingBalance: number;
  region: string;
  user: OrderUser | null;
}

export interface RecentOrdersResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
