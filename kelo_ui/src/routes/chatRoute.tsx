import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import ChatPanel from "@/presentation/views/chatPanel/ChatPanel";

export const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPanel,
});
