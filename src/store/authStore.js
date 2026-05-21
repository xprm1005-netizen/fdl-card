import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  academy: null,
  loading: true,

  setUser: (user) => set({ user }),
  setAcademy: (academy) => set({ academy }),
  setLoading: (loading) => set({ loading }),
  clear: () => set({ user: null, academy: null, loading: false }),
}));
