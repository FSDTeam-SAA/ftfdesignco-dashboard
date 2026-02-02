// features/auth/api/resetpassword.api.ts
import { api } from "@/lib/api";

export const resetPassword = async (data: { email: string; newPassword: string }) => {
    try {
        const res = await api.post('/auth/reset-password', data);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (data: { userId: string; oldPassword: string; newPassword: string }, accessToken: string) => {
    try {
        const res = await api.post('/auth/change-password', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};
