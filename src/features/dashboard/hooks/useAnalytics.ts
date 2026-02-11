// src/features/dashboard/hooks/useAnalytics.ts
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../api/analytics";

export const useAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
