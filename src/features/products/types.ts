export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  _id: string;
  title: string;
  sku?: string;
  description: string;
  type: string;
  size: string;
  price: number;
  availableQuantity: number;
  status: "active" | "inactive";
  role?: string;
  rigion?: string;
  region?: string;
  image?: string | ProductImage;
  images?: (string | ProductImage)[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateProductData {
  title?: string;
  sku?: string;
  description?: string;
  type?: string;
  size?: string;
  price?: number;
  availableQuantity?: number;
  status?: "active" | "inactive";
  image?: string;
  images?: string[];
}

export interface CreateProductData {
  title: string;
  description: string;
  type: string;
  size: string;
  price: number;
  availableQuantity: number;
  status: "active" | "inactive";
  role: string;
  sku?: string;
  image?: File | string;
  images?: (File | string)[];
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  data: Product[];
  pagination: PaginationMetadata;
}

export interface CommonResponse {
  success: boolean;
  message: string;
}
