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
const USER_KEY = 'user';
const TOKEN_KEY = 'token';
const VALID_ROLES: UserRole[] = ['student', 'warden', 'admin'];

export function isUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && VALID_ROLES.includes(role as UserRole);
}

export function inferRoleFromEmail(email: string): UserRole {
  const normalized = email.toLowerCase();
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('warden')) return 'warden';
  return 'student';
}

export function normalizeRole(role: unknown, email = ''): UserRole {
  const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : '';
  if (isUserRole(normalizedRole)) return normalizedRole;
  return inferRoleFromEmail(email);
}

function normalizeText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeId(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return Date.now();
}

export function normalizeAuthUser(value: unknown): AuthUser | null {
  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;
  const email = normalizeText(record.email, '').toLowerCase();
  const role = normalizeRole(record.role, email);
  const username = normalizeText(record.username, email.split('@')[0] || role);

  return {
    id: normalizeId(record.id),
    firstName: normalizeText(record.firstName, role.charAt(0).toUpperCase() + role.slice(1)),
    lastName: normalizeText(record.lastName, 'User'),
    username,
    email,
    role,
    preferences: record.preferences ?? {},
  };
}

export function getMockUsers(): MockStoredUser[] {
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(MOCK_USERS_KEY);
      return [];
    }

    const users = parsed.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const record = entry as Record<string, unknown>;
      const user = normalizeAuthUser(record.user);
      const password = typeof record.password === 'string' ? record.password : '';
      return user ? [{ user, password }] : [];
    });

    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    return users;
  } catch {
    localStorage.removeItem(MOCK_USERS_KEY);
    return [];
  }
}

export function saveMockUser(user: AuthUser, password: string): void {
  const normalizedUser = normalizeAuthUser(user) ?? user;
  const users = getMockUsers().filter((entry) => entry.user.email !== normalizedUser.email);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([{ user: normalizedUser, password }, ...users]));
}

export function createMockSession(user: AuthUser): void {
  const normalizedUser = normalizeAuthUser(user) ?? user;
  localStorage.setItem(TOKEN_KEY, `mock-session-${normalizedUser.role}-${normalizedUser.id}`);
  localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);

    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const normalizedUser = normalizeAuthUser(JSON.parse(stored));
      if (!normalizedUser) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } else {
        localStorage.setItem(TOKEN_KEY, `mock-session-${normalizedUser.role}-${normalizedUser.id}`);
        localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
        setUser(normalizedUser);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    setLoading(false);
  }, []);

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return { user, loading, logout };
}

export function roleDashboard(role: unknown): string {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'warden') return '/warden/dashboard';
  if (normalizedRole === 'admin') return '/admin/dashboard';
  return '/student/dashboard';
}
