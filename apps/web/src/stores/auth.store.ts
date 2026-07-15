import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthPayload } from '../types';

interface AuthState {
  user: AuthPayload | null;
  isAuthenticated: boolean;
  login: (payload: AuthPayload) => void;
  logout: () => void;
  getToken: () => string | null;
  hasPermission: (...perms: string[]) => boolean;
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

      hasPermission: (...perms: string[]) => {
        const user = get().user;
        if (!user) return false;
        if (user.role === 'ADMIN') return true;
        return perms.every((p) => user.permissions?.includes(p));
      },
    }),
    {
      name: 'controlproject-auth',
    },
  ),
);
