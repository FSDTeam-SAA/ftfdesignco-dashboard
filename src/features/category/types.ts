export interface Category {
  _id: string;
  roleTitle: string;
  images: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddCategoryPayload {
  roleTitle: string;
  images: File;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}
