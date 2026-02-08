export interface InventoryImage {
  url: string;
  publicId: string;
}

export interface InventoryItem {
  _id: string;
  image: string | InventoryImage;
  images?: (string | InventoryImage)[];
  title: string;
  type: string;
  description: string;
  size: string;
  availableQuantity: number;
  price: number;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // targetRoles: string[];
  totalOrderedQuantity: number;
}

export interface InventoryMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface InventoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: InventoryItem[];
  meta: InventoryMeta;
}
