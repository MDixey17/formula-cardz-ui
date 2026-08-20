import type {
  AuthResponse,
  CardResponse,
  Drop,
  OneOfOneCard,
  OwnershipEntry,
  RegisterPayload,
  SetOption,
  UserProfile,
} from '@/types';

const BASE_URL = 'https://formula-cardz-api.onrender.com';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('fc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers as Record<string, string>),
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Network error. Check your connection and try again.');
  }

  if (res.status === 401) {
    localStorage.removeItem('fc_token');
    throw new ApiError('Your session has expired. Please log in again.', 401);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || body.error || body.title || message;
    } catch {
      // body wasn't JSON
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const api = {
  getSets: () => request<SetOption[]>('/v1/dropdown/sets'),

  getOneOfOnes: (setName: string) =>
      request<OneOfOneCard[]>(
          `/v1/oneofones?setName=${encodeURIComponent(setName)}`
      ),

  getDrops: () => request<Drop[]>('/v1/drops'),

  getCards: (setName: string) =>
      request<CardResponse[]>(
          `/v1/cards?setName=${encodeURIComponent(setName)}`
      ),

  login: (payload: { email: string; password: string; username?: string }) =>
      request<AuthResponse>('/v1/auth/login?expireOverride=30d', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

  register: (payload: RegisterPayload) =>
      request<AuthResponse>('/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

  forgotPassword: (email: string) =>
      request<{ message?: string }>('/v1/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

  resetPassword: (payload: {
    id: string;
    token: string;
    newPassword: string;
  }) =>
      request<{ message?: string }>('/v1/auth/reset-password', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),

  getOwnership: (userId: string) =>
      request<OwnershipEntry[]>(`/v1/ownership/${userId}`),

  addOwnership: (entry: Omit<OwnershipEntry, '_id'>) =>
      request<OwnershipEntry>('/v1/ownership', {
        method: 'POST',
        body: JSON.stringify(entry),
      }),

  updateOwnership: (entry: Omit<OwnershipEntry, '_id'> & { _id?: string }) =>
      request<OwnershipEntry>('/v1/ownership', {
        method: 'PUT',
        body: JSON.stringify(entry),
      }),

  deleteOwnership: (entry: { _id?: string; userId: string; cardId: string }) =>
      request<void>('/v1/ownership', {
        method: 'DELETE',
        body: JSON.stringify(entry),
      }),

  getUser: (userId: string) =>
      request<UserProfile>(`/v1/user/${userId}`),

  updateUser: (userId: string, payload: Partial<UserProfile>) =>
      request<UserProfile>(`/v1/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),

  deleteUser: (userId: string) =>
      request<void>(`/v1/user/${userId}`, { method: 'DELETE' }),
};
