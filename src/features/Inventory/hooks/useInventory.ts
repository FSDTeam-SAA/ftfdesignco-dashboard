// src/features/dashboard/hooks/useAnalytics.ts
import { useQuery } from "@tanstack/react-query";
import { editProduct, getInventory } from "../api/Inventory";
import { useMutation } from "@tanstack/react-query";

export const useInventory = ( 
  region: string = "",
) => {
  return useQuery({
    queryKey: ["inventory", region],
    queryFn: () => getInventory(region),
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
