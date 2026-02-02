// features/auth/hooks/useverifycode.ts
"use client";
import { useState } from "react";

import { verifyCode as verifyCodeApi } from "../api/verifycode.api";

export function useVerifyCode() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const verifyCode = async (code: string, email: string) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await verifyCodeApi({ email, otp: code });
            setSuccess(response.message);
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return { verifyCode, loading, error, success };
}