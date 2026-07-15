import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  activeEventId: string | null;
  toggleSidebar: () => void;
  setActiveEvent: (eventId: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activeEventId: null,

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setActiveEvent: (eventId) => set({ activeEventId: eventId }),
    }),
    {
      name: 'controlproject-app',
    },
  ),
);
