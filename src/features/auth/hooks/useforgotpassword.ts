// features/auth/hooks/useresetpassword.ts
"use client";
import { useState } from "react";

import { forgotPassword as forgotPasswordApi } from "../api/forgotpassword.api";

export function useForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const forgotPassword = async (email: string) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await forgotPasswordApi({ email });
            setSuccess(response.message);
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return { forgotPassword, loading, error, success };
}