"use client";
import { useState } from "react";
import { isAxiosError } from "axios";
import { registeruser } from "../api/register.api";


export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (name: string, email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await registeruser({ name, email, password });

            return result;
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message || "Something went wrong");
            } else {
                setError("An unexpected error occurred");
            }
            return undefined;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleRegister };
}