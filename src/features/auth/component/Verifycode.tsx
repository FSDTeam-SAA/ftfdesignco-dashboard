// features/auth/component/Verifycode.tsx
"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useVerifyCode } from "../hooks/useverifycode";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Verifycode = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const router = useRouter();
  const { handleVerifyOtp, loading } = useVerifyCode();

  const handleChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    const res = await handleVerifyOtp(otpCode);

    if (res?.success) {
      toast.success("OTP verified successfully!");

      const urlParams = new URLSearchParams(globalThis.location.search);
      const token = urlParams.get("token");

      setTimeout(() => {
        router.push(`/new-password?token=${encodeURIComponent(token || "")}`);
      }, 1000);
    } else {
      toast.error(res?.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className=" max-w-3xl bg-white rounded-xl shadow-md px-10 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="sktchLABS"
            width={160}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-semibold text-primary mb-1">
          Verify Your Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Enter the 6-digit code sent to your email to continue.
        </p>

        <div className="bg-white w-full max-w-xl ">
          <form onSubmit={handleVerify}>
            {/* OTP Inputs */}
            <div className="flex items-center gap-3 justify-center mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={`w-14 h-14 text-2xl text-center border rounded-lg outline-none transition
                ${
                  digit
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-700"
                }`}
                />
              ))}
            </div>

            {/* Timer + Resend
            <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <TimerIcon className="w-5 h-5 text-gray-500" />
                <span>{String(timer).padStart(2, "0")} Second</span>
              </div>

              <div className="items-end">
                <span className="text-gray-500 text-md mr-2 mb-1">
                  Didn&apos;t get a code?
                </span>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`font-medium ${
                    canResend
                      ? "text-primary hover:underline cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Resend
                </button>
              </div>
            </div> */}

            <button
              className={`w-full bg-primary text-white py-3 rounded-md text-lg font-medium transition
    ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/80 cursor-pointer"}
  `}
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verifycode;
