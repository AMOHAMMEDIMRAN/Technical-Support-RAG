import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./routes/root";
import { indexRoute } from "./routes/index";
import { chatRoute } from "./routes/chat";
import { ThemeProvider } from "./presentation/components/theme/theme-provider";
import { useAuthInit } from "./presentation/hooks/useAuthInit";
import { dashboardRoute } from "./routes/dashboardRoute";

const routeTree = rootRoute.addChildren([indexRoute, chatRoute, dashboardRoute]);
const router = createRouter({ routeTree });

const App = () => {
  // Initialize auth state from localStorage on app load
  useAuthInit();

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
