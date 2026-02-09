import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./routes/root";
import { indexRoute } from "./routes/index";
import { ThemeProvider } from "./presentation/components/theme/theme-provider";



const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });

const App = () => {
  return <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>;
};

export default App;
