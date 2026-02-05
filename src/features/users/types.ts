export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserResponse {
  data: User[];
  pagination: PaginationMetadata;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: "active" | "inactive";
}

export interface CommonUserResponse {
  success: boolean;
  message: string;
  data?: User;
}
