"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { useChangePassword } from '../hooks/usechangepassword';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
    const router = useRouter();
    const { handleChangePassword, loading, error: apiError } = useChangePassword();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (newPassword !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setLocalError("Password must be at least 6 characters");
            return;
        }

        const userId = "69601438dd15900adb7cec25"; // Hardcoded as per requirements

        const res = await handleChangePassword({
            userId,
            oldPassword,
            newPassword
        });

        if (res) {
            // potentially redirect or show success message
            // For now, maybe just clear form or alert
            alert("Password changed successfully");
            router.push('/login'); // Assuming login route exists
        }
    };

    const toggleOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-3xl bg-white p-8">

                {/* Logo */}
                <div className="flex flex-col items-center justify-center gap-2 mb-6">
                    <Image src="/images/logo.png" alt="sktchLABS" width={180} height={50} className="object-contain" />
                </div>

                {/* Title */}
                <h2 className="text-center text-[#E88741] text-3xl font-bold mb-2">
                    Create a New Password
                </h2>
                <p className="text-center text-gray-500 mb-10 text-lg">
                    Set a strong password to secure your account.
                </p>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Old Password - Added for API requirement */}
                    {/* Using a visually hidden style or just a normal field? 
                         Since the user explicitly asked to follow the screenshot (which doesn't have it)
                         BUT also asked to send it in the body. I MUST hide it or show it. 
                         Hiding it means the user can't input it, which fails the API.
                         So I MUST show it. I'll style it similarly.
                     */}
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-2">
                            Old Password
                        </label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                placeholder="********"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E88741]/50 focus:border-[#E88741]"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleOldPassword}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

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
                                onClick={toggleNewPassword}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
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
                                onClick={toggleConfirmPassword}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Error display */}
                    {(localError || apiError) && (
                        <div className="text-red-500 text-sm text-center">
                            {localError || apiError}
                        </div>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full mt-8 bg-[#FA923C] hover:bg-[#F97316] text-white text-lg font-medium py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        disabled={loading}
                    >
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;