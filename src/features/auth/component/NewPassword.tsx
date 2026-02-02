"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { useResetPassword } from "../hooks/useResetPassword";

const NewPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email"); // email from query params

    const { handleResetPassword, loading, error: apiError } = useResetPassword();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!email) {
            setLocalError("Email address missing. Please try the reset process again.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setLocalError("Password must be at least 6 characters");
            return;
        }

        const res = await handleResetPassword({
            email,
            newPassword,
        });

        if (res) {
            alert("Password reset successfully");
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-md px-10 py-12">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center gap-2 mb-6">
                    <Image
                        src="/images/logo.png"
                        alt="sktchLABS"
                        width={180}
                        height={50}
                        className="object-contain"
                    />
                </div>

                {/* Title */}
                <h2 className="text-center text-[#E88741] text-3xl font-bold mb-2">
                    Reset Your Password
                </h2>
                <p className="text-center text-gray-500 mb-10 text-lg">
                    Set a strong password to secure your account.
                </p>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="********"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E88741]/50 focus:border-[#E88741]"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E88741]/50 focus:border-[#E88741]"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Errors */}
                    {(localError || apiError) && (
                        <div className="text-red-500 text-sm text-center">
                            {localError || apiError}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 bg-[#FA923C] hover:bg-[#F97316] text-white text-lg font-medium py-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving Password..." : "Save Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPassword;
