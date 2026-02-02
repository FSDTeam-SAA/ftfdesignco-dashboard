// features/auth/component/Register.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useRegister } from "../hooks/useregister";

const Register = () => {
  const { loading, error, handleRegister } = useRegister();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const name = `${capitalize(firstName)} ${capitalize(lastName)}`;
    const res = await handleRegister(name, email, password);
    if (res && !res.error) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-6xl bg-white rounded-xl shadow-lg p-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            width={120}
            height={120}
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-primary text-2xl font-semibold mb-2">
          Welcome
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Manage your orders, track shipments, and configure products easily.
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:bg-primary/5 focus:ring-primary"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:bg-primary/5 focus:ring-primary"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:bg-primary/5 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Options */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm mt-4 px-1">
            <label className="flex items-center gap-3 text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary transition-all cursor-pointer"
                required
              />
              <span className="text-sm">
                I agree to the <Link href="/privacy-policy" className="text-primary font-medium hover:underline transition-all">Privacy Policy</Link>
              </span>
            </label>

            <p className="text-sm text-gray-600 flex items-center gap-1">
              Already have an account?
              <Link
                href="/login"
                className="text-primary font-semibold hover:text-primary/80 transition-all hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-primary cursor-pointer hover:bg-primary/90 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
