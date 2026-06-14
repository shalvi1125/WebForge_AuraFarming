import { useEffect, useState } from 'react';

export type UserRole = 'student' | 'warden' | 'admin';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole;
  preferences: Record<string, unknown>;
}

interface AuthResponse {
  success?: boolean;
  sessionToken: string;
  user: AuthUser;
}

export interface SignupInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  preferences?: unknown;
}

const USER_KEY = 'user';
const TOKEN_KEY = 'token';
const VALID_ROLES: UserRole[] = ['student', 'warden', 'admin'];

export function isUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && VALID_ROLES.includes(role as UserRole);
}

export function roleDashboard(role: unknown): string {
  if (role === 'warden') return '/warden/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'student') return '/student/dashboard';
  return '/login';
}

function normalizeText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function normalizeAuthUser(value: unknown): AuthUser | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const role = record.role;
  if (!isUserRole(role)) return null;
  const email = normalizeText(record.email, '').toLowerCase();
  if (!email) return null;
  const username = normalizeText(record.username, email.split('@')[0] || role);

  return {
    id: normalizeText(record.id, ''),
    firstName: normalizeText(record.firstName, role.charAt(0).toUpperCase() + role.slice(1)),
    lastName: normalizeText(record.lastName, 'User'),
    username,
    email,
    role,
    preferences: record.preferences && typeof record.preferences === 'object' ? record.preferences as Record<string, unknown> : {},
  };
}

function saveAuthSession(sessionToken: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, sessionToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function authRequest(path: string, body: object): Promise<AuthResponse> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof payload?.error === 'string' ? payload.error : 'Authentication failed');
  }
  const user = normalizeAuthUser(payload?.user);
  const sessionToken = typeof payload?.sessionToken === 'string' ? payload.sessionToken : '';
  if (!user || !sessionToken) throw new Error('Invalid authentication response');
  saveAuthSession(sessionToken, user);
  return { success: true, sessionToken, user };
}

export function loginWithPassword(email: string, password: string) {
  return authRequest('/api/auth/login', { email, password });
}

export function signupWithPassword(input: SignupInput) {
  return authRequest('/api/auth/signup', input);
}

export async function restoreAuthSession(): Promise<AuthUser | null> {
  const sessionToken = localStorage.getItem(TOKEN_KEY);
  if (!sessionToken) {
    clearAuthSession();
    return null;
  }

  const response = await fetch('/api/auth/validate-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionToken }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    clearAuthSession();
    return null;
  }
  const user = normalizeAuthUser(payload?.user);
  if (!user) {
    clearAuthSession();
    return null;
  }
  saveAuthSession(sessionToken, user);
  return user;
}

export async function logoutSession() {
  const sessionToken = localStorage.getItem(TOKEN_KEY);
  clearAuthSession();
  if (!sessionToken) return;
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionToken }),
  }).catch(() => undefined);
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    restoreAuthSession()
      .then((restoredUser) => {
        if (active) setUser(restoredUser);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function logout() {
    await logoutSession();
    setUser(null);
  }

  return { user, loading, logout };
}
