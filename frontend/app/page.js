'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check logged in status
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/bookings');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`,
        { email, phone }
      );

      localStorage.setItem('authToken', response.data.token);
      router.push('/bookings');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Portal</h1>
          <p className="text-purple-100">Manage your bookings with ease</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="test@example.com"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input-field"
                placeholder="0123456789"
              />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Demo Credentials:</p>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> test@example.com
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> 0123456789
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-purple-100 text-xs mt-8">
          © 2025 Customer Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
