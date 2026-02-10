import { create } from "zustand";
import type { User } from "@/core/domain/types";
import { authService } from "@/infrastructure/api/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login({ email, password });

      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });

    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Set user
  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Initialize auth from storage
  initAuth: () => {
    const user = authService.getStoredUser();
    const token = authService.getStoredToken();

    set({
      user,
      token,
      isAuthenticated: !!token,
    });
  },
}));
