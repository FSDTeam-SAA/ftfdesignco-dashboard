// features/auth/api/resetpassword.api.ts
import { api } from "@/lib/api";

export const resetPassword = async (
  data: { newPassword: string; confirmPassword: string },
  token: string,
) => {
  const res = await api.post("/auth/reset-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const changePassword = async (
  data: { userId: string; oldPassword: string; newPassword: string },
  accessToken: string,
) => {
  const res = await api.post("/auth/change-password", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
