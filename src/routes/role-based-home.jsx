import {Navigate} from "react-router-dom";
import {useAuth} from "@/hooks/use-auth";

export default function RoleBasedHome() {
  const {user} = useAuth();
  const roles = Array.isArray(user?.roles) ? user.roles.map((r) => String(r).toUpperCase()) : [];
  if (roles.includes("ADMIN")) return <Navigate to="/admin/playground" replace/>;
  return <Navigate to="/forbidden" replace/>;
}
