import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./routes/root";
import { indexRoute } from "./routes/index";
import { ThemeProvider } from "./presentation/components/theme/theme-provider";
import { useAuthInit } from "./presentation/hooks/useAuthInit";
 
const routeTree = rootRoute.addChildren([indexRoute]);
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
