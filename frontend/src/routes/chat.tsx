import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./root";
import ChatPanel from "@/presentation/views/chatPanel/ChatPanel";
import { authService } from "@/infrastructure/api/auth.service";

export const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPanel,
  beforeLoad: () => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to home page if not authenticated
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
});
