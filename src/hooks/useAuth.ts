"use client"

import { useEffect, useState, useCallback } from 'react';

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json();
      setUser(data?.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return { user, loading, isAuthenticated, logout, refetch: fetchUser };
}
