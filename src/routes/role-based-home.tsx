import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function RoleBasedHome() {
  const { user } = useAuth();

  const roles = Array.isArray(user?.roles)
    ? user.roles.map((r) => {
        const roleName = typeof r === "string" ? r : r?.name || "";
        return String(roleName).toUpperCase();
      })
    : [];

  // Redirect to publications page for all authenticated users
  if (roles.length > 0) {
    return <Navigate to="/marketplace-refactored/publications" replace />;
  }

  // If no roles, redirect to 404
  return <Navigate to="/404" replace />;
}
