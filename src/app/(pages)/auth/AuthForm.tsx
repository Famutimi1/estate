"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter();
  const isLogin = mode === 'login';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  // Import useAuth for proper state management
  const { refetch } = useAuth();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<'user' | 'agent'>('user');
  
  // Countdown timer effect
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        // Refetch auth state to update UI immediately
        await refetch();
        // Force a page refresh to ensure all components update
        window.location.href = '/';
      } else {
        setError(data.error?.message || 'Failed to sign in');
      }
    } catch (err) {
      if (err instanceof Error) {
         setError(err.message || 'An unexpected error occurred');
      }
     
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordError(null);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setForgotPasswordError('Please enter a valid email address');
      setForgotPasswordLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      const data = await res.json();
      
      if (data.success) {
        setForgotPasswordSuccess(true);
        setResendCountdown(30); // Start 30-second countdown
      } else {
        setForgotPasswordError(data.error?.message || 'Failed to send reset email');
      }
    } catch (err) {
      if (err instanceof Error) {
        setForgotPasswordError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate passwords match
    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          role: registerRole
        }),
      });
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        // Refetch auth state to update UI immediately
        await refetch();
        // Force a page refresh to ensure all components update
        window.location.href = '/';
      } else {
        setError(data.error?.message || 'Failed to register');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred');
     }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex">
          <button
            className={`w-1/2 py-4 text-center font-medium ${isLogin ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => router.push('/auth/login')}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-4 text-center font-medium ${!isLogin ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => router.push('/auth/register')}
          >
            Register
          </button>
        </div>
        
        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLogin}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <button 
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-700 hover:text-blue-500 focus:outline-none focus:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a new account</h2>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="register-email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="register-password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                />
              </div>
              
              {/* <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Account Type
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="role-user"
                      type="radio"
                      name="role"
                      checked={registerRole === 'user'}
                      onChange={() => setRegisterRole('user')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="role-user" className="ml-2 block text-sm text-gray-700">
                      Home Buyer/Renter
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="role-agent"
                      type="radio"
                      name="role"
                      checked={registerRole === 'agent'}
                      onChange={() => setRegisterRole('agent')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="role-agent" className="ml-2 block text-sm text-gray-700">
                      Real Estate Agent
                    </label>
                  </div>
                </div>
              </div> */}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-700 hover:text-blue-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-700 hover:text-blue-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reset Your Password</h3>
              
              {!forgotPasswordSuccess ? (
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label htmlFor="reset-email" className="block text-gray-700 text-sm font-bold mb-2">
                      Email Address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  {forgotPasswordError && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                      <p className="text-sm">{forgotPasswordError}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordEmail('');
                        setForgotPasswordError(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-sm hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotPasswordLoading}
                      className="px-4 py-2 bg-blue-700 text-white rounded-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {forgotPasswordLoading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                    <p className="text-sm">
                      If an account with that email exists, password reset instructions have been sent. 
                      Please check your inbox and follow the instructions to reset your password.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {resendCountdown > 0 ? (
                      <div className="text-center text-gray-600 text-sm">
                        Resend available in <span className="font-semibold text-blue-600">{resendCountdown}s</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordSuccess(false);
                          setForgotPasswordError(null);
                          handleForgotPassword({ preventDefault: () => {} } as React.FormEvent);
                        }}
                        disabled={forgotPasswordLoading}
                        className="w-full px-4 py-2 bg-blue-700 text-white rounded-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
                      >
                        {forgotPasswordLoading ? 'Sending...' : 'Resend Email'}
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordEmail('');
                        setForgotPasswordSuccess(false);
                        setForgotPasswordError(null);
                        setResendCountdown(0);
                      }}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
