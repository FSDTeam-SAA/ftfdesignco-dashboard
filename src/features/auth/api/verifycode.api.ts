import { api } from '@/lib/api';
// features/auth/api/verifycode.api.ts
 
// Verify OTP
export const verifyOtp = async (
  payload: { otp: string },
  tokenFromURL: string,
) => {
  // console.log(tokenFromURL);
  try {
    const response = await api.post("/auth/verify-otp", payload, {
      headers: {
        Authorization: `Bearer ${tokenFromURL}`,
      },
    });

    return { success: true, data: response.data };
  } catch {
    return {
      success: false,
      message: "Verification failed",
    };
  }
};
