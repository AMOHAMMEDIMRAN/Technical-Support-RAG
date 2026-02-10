import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./routes/root";
import { indexRoute } from "./routes/index";
import { chatRoute } from "./routes/chat";
import { ThemeProvider } from "./presentation/components/theme/theme-provider";
import { TooltipProvider } from "./presentation/components/ui/tooltip";
import { useAuthInit } from "./presentation/hooks/useAuthInit";
import {
  dashboardRoute,
  dashboardIndexRoute,
  dashboardUsersRoute,
  dashboardOrganizationRoute,
  dashboardSettingsRoute,
} from "./routes/dashboardRoute";

const routeTree = rootRoute.addChildren([
  indexRoute,
  chatRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    dashboardUsersRoute,
    dashboardOrganizationRoute,
    dashboardSettingsRoute,
  ]),
]);
const router = createRouter({ routeTree });

const App = () => {
  // Initialize auth state from localStorage on app load
  useAuthInit();

  return (
    <ThemeProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
