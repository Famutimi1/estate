"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      // Force a page refresh to ensure all components update
      window.location.href = '/';
    };
    performLogout();
  }, [logout]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-sm w-full text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Signing you out...</p>
      </div>
    </div>
  );
}
