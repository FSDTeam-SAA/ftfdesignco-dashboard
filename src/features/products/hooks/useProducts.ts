import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  editProduct,
  getProducts,
  addProduct,
} from "../api/products";
import { ProductFilters } from "../types";

// Get All products
export const useProducts = (
  page: number = 1,
  limit: number = 10,
  filters: ProductFilters = {},
) => {
  return useQuery({
    queryKey: ["products", page, limit, filters],
    queryFn: () => getProducts(page, limit, filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// edit product
export const useEditProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
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
    mutationFn: (data: FormData) => addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
