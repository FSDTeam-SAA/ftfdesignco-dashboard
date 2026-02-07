import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  editProduct,
  getProducts,
  addProduct,
} from "../api/products";
import { UpdateProductData, CreateProductData } from "../types";

// Get All products
export const useProducts = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: () => getProducts(page, limit, search),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// edit product
export const useEditProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      editProduct(id, data),
  });
};

// product delete
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// add product
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductData) => addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
