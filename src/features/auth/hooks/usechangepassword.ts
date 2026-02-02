// features/auth/hooks/usechangepassword.ts
import { useState } from "react";
import { changePassword } from "../api/resetpassword.api";
import { useSession } from "next-auth/react";

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    const handleChangePassword = async (data: { userId: string; oldPassword: string; newPassword: string }) => {
        setLoading(true);
        setError(null);

        if (!session?.accessToken) {
            // Try to use session user token if accessToken is not at root
            // Based on next-auth route, it seems it is at root of session, but let's be safe?
            // Actually, the type defs in route.ts say session.accessToken is string.
            // If implicit session is missing, we can't do much.
            setError("You must be logged in to change your password.");
            return;
        }

        try {
            const res = await changePassword(data, session.accessToken);
            return res;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleChangePassword };
};