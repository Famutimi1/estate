"use client";

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

export function useProfile() {
  const { user, refetch: refetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      // Refetch user data to get updated profile
      await refetchUser();
      return { success: true, message: result.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [refetchUser]);

  const deleteAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete account');
      }

      // Clear local storage and redirect will be handled by the component
      localStorage.removeItem('token');
      return { success: true, message: result.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to change password');
      }

      return { success: true, message: result.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      console.log('useProfile: Starting avatar upload for file:', file.name);
      setLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        console.log('useProfile: No token found');
        throw new Error('Authentication required');
      }

      console.log('useProfile: Token found, creating form data');

      const formData = new FormData();
      formData.append('file', file);

      console.log('useProfile: Sending request to /api/user/avatar');

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('useProfile: Response received:', response.status);

      const result = await response.json();

      console.log('useProfile: Response data:', result);

      if (!response.ok) {
        console.log('useProfile: Upload failed:', result.error);
        throw new Error(result.error || 'Failed to upload avatar');
      }

      console.log('useProfile: Upload successful, refetching user data');

      // Refetch user data to get updated avatar
      await refetchUser();
      
      console.log('useProfile: User data refetched successfully');
      
      return { success: true, message: result.message, avatarUrl: result.avatarUrl, publicId: result.publicId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      console.error('useProfile: Upload error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [refetchUser]);

  return {
    user,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    changePassword,
    clearError: () => setError(null),
  };
}
