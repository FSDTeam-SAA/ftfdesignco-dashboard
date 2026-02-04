"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyOtp as verifyCodeApi } from "../api/verifycode.api";
import { forgotPassword as forgotPasswordApi } from "../api/forgotpassword.api";

export function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    const token = searchParams.get("token") || "";
    // console.log(token)
    try {
      const res = await verifyCodeApi({ otp }, token);
      setLoading(false);
      return res;
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      };
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const email = searchParams.get("email") || "";
    if (!email) {
      setLoading(false);
      return { success: false, message: "Email not found" };
    }
    try {
      await forgotPasswordApi({ email });
      setLoading(false);
      return { success: true, message: "OTP resent successfully" };
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      };
    }
  };

  return { handleVerifyOtp, handleResendOtp, loading };
}
