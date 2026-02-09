import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import HomePage from "../presentation/views/home/HomePage";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
