"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(result.error);
                return undefined;
            }

            return result;
        } catch {
            setError("Something went wrong");
            return undefined;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleLogin };
}