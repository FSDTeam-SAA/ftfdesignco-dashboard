// features/dashboard/api/analytics.api.ts

import axiosInstance from "@/instance/axios-instance";

 
export const getAnalytics = async () => {
  try {
    const response = await axiosInstance.get("/analytics/overview");
    return response.data;
  } catch (error) {
    throw error;
  }
};
