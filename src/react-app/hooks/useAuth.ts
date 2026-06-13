import { useState, useEffect } from 'react';

export type UserRole = 'student' | 'warden' | 'admin';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole;
  preferences: unknown;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');

    if (!token || !stored) {
      setLoading(false);
      return;
    }

    // Optimistically set user from localStorage, then validate with server
    try {
      setUser(JSON.parse(stored) as AuthUser);
    } catch {
      // Corrupt localStorage — clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
      return;
    }

    fetch('/api/auth/validate-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken: token }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const freshUser = data.user as AuthUser;
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      })
      .catch(() => {
        // Session invalid — clear
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token }),
      }).catch(() => {});
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return { user, loading, logout };
}

export function roleDashboard(role: UserRole): string {
  if (role === 'warden') return '/warden/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/student/dashboard';
}
