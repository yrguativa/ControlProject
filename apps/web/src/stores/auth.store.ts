import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthPayload, User, UserRole } from '../types';

interface AuthState {
  user: AuthPayload | null;
  isAuthenticated: boolean;
  login: (payload: AuthPayload) => void;
  logout: () => void;
  getToken: () => string | null;
  hasRole: (...roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (payload: AuthPayload) => {
        set({ user: payload, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      getToken: () => get().user?.accessToken ?? null,

      hasRole: (...roles: UserRole[]) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role as UserRole);
      },
    }),
    {
      name: 'controlproject-auth',
    },
  ),
);
