// src/features/dashboard/hooks/useAnalytics.ts
import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../api/Inventory";

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
