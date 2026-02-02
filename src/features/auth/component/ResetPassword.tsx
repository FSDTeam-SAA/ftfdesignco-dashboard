// features/auth/component/ResetPassword.tsx
"use client";

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForgotPassword } from '../hooks/useforgotpassword'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const { forgotPassword, loading, error, success } = useForgotPassword()
  const router = useRouter()

  useEffect(() => {
    if (success) {
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
    }
  }, [success, router, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    await forgotPassword(email)
  }
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
          Reset Password
        </h2>
        <p className="text-center text-base text-gray-500 mb-8">
          Enter your email address and we&apos;ll send you a code to reset your password.
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>



          {/* Error and Success Messages */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-primary cursor-pointer hover:bg-primary/80 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>


      </div>
    </div>
  )
}

export default ResetPassword