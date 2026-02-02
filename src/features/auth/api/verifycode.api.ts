// features/auth/api/verifycode.api.ts
import { api } from "@/lib/api";
import { VerifyCodeFormData } from "../types";

export const verifyCode = async (formData: VerifyCodeFormData) => {
    try {
        const response = await api.post("/auth/verify-code", formData);
        return response.data;
    } catch (error) {
        throw error;
    }
}