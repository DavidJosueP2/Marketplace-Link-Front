import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function RoleBasedHome() {
  const { user } = useAuth();

  const roles: string[] = Array.isArray(user?.roles)
    ? user.roles
      .map((r: any) => (typeof r === "string" ? r : r?.name || ""))
      .map((n: string) => n.toUpperCase())
    : [];

  const has = (r: string) => roles.includes(r);
  const isStaff =
    has("ROLE_ADMIN") || has("ROLE_MODERATOR") || has("ROLE_SUPER_ADMIN");

  if (isStaff) return <Navigate to="/marketplace-refactored/incidencias" replace />;
  if (has("ROLE_SELLER")) return <Navigate to="/marketplace-refactored/mis-productos" replace />;
  if (has("ROLE_BUYER")) return <Navigate to="/marketplace-refactored/publications" replace />;

  return <Navigate to="/404" replace />;
}
