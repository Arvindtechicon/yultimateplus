"use client";

import type { User } from '@/lib/mockData';
import { users } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  login: (role: User['role']) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('y-ultimate-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('y-ultimate-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((role: User['role']) => {
    // Find the first user with the specified role to log in as.
    const userToLogin = users.find(u => u.role === role);
    if (userToLogin) {
      setUser(userToLogin);
      localStorage.setItem('y-ultimate-user', JSON.stringify(userToLogin));
      router.push('/dashboard');
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('y-ultimate-user');
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
