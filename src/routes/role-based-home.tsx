import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import roleService from "@/services/role.service.js";

export default function RoleBasedHome() {
  const { user } = useAuth();

  const roles = Array.isArray(user?.roles)
    ? user.roles.map((r) => {
        const roleName = typeof r === "string" ? r : r?.name || "";
        return String(roleName).toUpperCase();
      })
    : [];

  if (roles.includes(roleService.getRoleAdmin()))
    return <Navigate to="/admin/playground" replace />;

  return <Navigate to="/404" replace />;
}
