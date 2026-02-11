export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  homeAddress?: string;
  city?: string;
  region?: string;
  categoryName?: string;
  location?: string;
  balance?: number;
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
  password?: string;
  phoneNumber?: string;
  homeAddress?: string;
  city?: string;
  region?: string;
  categoryName?: string;
  location?: string;
  balance?: number;
  status?: "active" | "inactive";
}

export interface CommonUserResponse {
  success: boolean;
  message: string;
  data?: User;
}

export interface AddUserData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  homeAddress: string;
  city: string;
  region: string;
  categoryName: string;
  // companyName: string;
  location: string;
  balance: number;
}
export interface CSVErrorDetail {
  identifier: string;
  reason: string;
}

export interface CSVImportSummary {
  total: number;
  success: number;
  failed: number;
  errors: CSVErrorDetail[];
}

export interface CSVImportResponse {
  success: boolean;
  message: string;
  data?: CSVImportSummary;
}
