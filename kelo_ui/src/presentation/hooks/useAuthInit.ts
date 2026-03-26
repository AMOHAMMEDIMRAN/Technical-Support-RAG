import { useEffect } from "react";
import { useAuthStore } from "@/presentation/stores/authStore";

/**
 * Hook to initialize authentication state from localStorage
 * Call this at the root of your application
 */
export const useAuthInit = () => {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);
};
