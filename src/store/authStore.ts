"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginApi } from "@/services/api/authApi";
import { LoginPayload, User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  isLoading: boolean;
  setHydrated: (value: boolean) => void;
  login: (payload: LoginPayload) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      isLoading: false,
      setHydrated: (value) => set({ isHydrated: value }),
      login: async (payload) => {
        set({ isLoading: true });
        try {
          const data = await loginApi(payload);
          const user: User = {
            id: data.userId,
            name: data.name,
            email: data.email,
            token: data.token,
          };
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "calendar_poc_auth_store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
