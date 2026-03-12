export interface OrderUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

export interface OrderProduct {
  _id: string;
  quantity: number;
  size: string;
  productId: {
    _id: string;
    images: ProductImage[];
    title: string;
    type: string;
    description: string;
    size: string;
    availableQuantity: number;
    price: number;
    targetRoles: string[];
    status: string;
    rigion: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface Order {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  status: "new" | "inprogress" | "shipped/complete";
  totalAmount: number;
  remainingBalance: number;
  region: string;
  user: OrderUser | null;
  products: OrderProduct[];
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
