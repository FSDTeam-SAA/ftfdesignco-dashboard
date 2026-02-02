// features/auth/api/resetepassword.api.ts
import { api } from "@/lib/api";
import { ForgotPasswordFormData } from "../types";

export const forgotPassword = async (formData: ForgotPasswordFormData) => {
    try {
        const response = await api.post("/auth/forget-password", formData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

