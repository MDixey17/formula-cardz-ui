import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, ApiError } from '@/lib/api';
import type { AuthResponse } from '@/types';

interface AuthState {
  user: AuthResponse | null;
  loading: boolean;
  login: (email: string, password: string, username?: string) => Promise<void>;
  register: (payload: import('@/types').RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (u: AuthResponse | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = 'fc_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem('fc_token', user.token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('fc_token');
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string, username?: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password, username });
      setUser(res);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: import('@/types').RegisterPayload) => {
    setLoading(true);
    try {
      const res = await api.register(payload);
      setUser(res);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const fresh = await api.getUser(user.id);
      setUser({ ...user, ...fresh, token: user.token });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) logout();
    }
  }, [user, logout]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser, setUser }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
