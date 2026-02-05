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
  targetRoles?: string[];
  image?: string | ProductImage;
  images?: string[]; // Used in some items in the JSON
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
  sku?: string;
  image?: string;
  images?: string[];
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
