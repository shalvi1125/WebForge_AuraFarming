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

export interface MockStoredUser {
  user: AuthUser;
  password: string;
}

const MOCK_USERS_KEY = 'mockUsers';

export function getMockUsers(): MockStoredUser[] {
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    return stored ? (JSON.parse(stored) as MockStoredUser[]) : [];
  } catch {
    localStorage.removeItem(MOCK_USERS_KEY);
    return [];
  }
}

export function saveMockUser(user: AuthUser, password: string): void {
  const users = getMockUsers().filter((entry) => entry.user.email !== user.email);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([{ user, password }, ...users]));
}

export function createMockSession(user: AuthUser): void {
  localStorage.setItem('token', `mock-session-${user.role}-${user.id}`);
  localStorage.setItem('user', JSON.stringify(user));
}

export function inferRoleFromEmail(email: string): UserRole {
  const normalized = email.toLowerCase();
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('warden')) return 'warden';
  return 'student';
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');

    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(stored) as AuthUser);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    setLoading(false);
  }, []);

  function logout() {
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
