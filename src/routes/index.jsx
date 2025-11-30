import { publicRoutes } from "./public.routes.jsx";
import { protectedRoutes } from "./protected.routes.jsx";

export const routes = [...publicRoutes, ...protectedRoutes];
