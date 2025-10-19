import { publicRoutes } from "./public.routes";
import { protectedRoutes } from "./protected.routes";

export const routes = [...publicRoutes, ...protectedRoutes];
