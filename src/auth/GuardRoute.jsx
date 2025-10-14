import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const norm = (r) => String(r || "").trim().toUpperCase();
const hasAny = (userRoles, allowed = []) =>
    !allowed?.length || allowed.some((r) => userRoles.includes(norm(r)));
const hasAll = (userRoles, required = []) =>
    !required?.length || required.every((r) => userRoles.includes(norm(r)));

export function GuardRoute({
   allowedRoles = [],
   requiredRoles = [],
   redirectToLogin = "/login",
   redirectToForbidden = "/forbidden",
   fallback = (
       <div className="min-h-dvh grid place-items-center">
           <div className="size-12 animate-spin rounded-full border-b-2" />
       </div>
   ),
   children,
}) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (isLoading) return fallback;
    if (!isAuthenticated)
        return <Navigate to={redirectToLogin} state={{ from: location }} replace />;

    const roles = Array.isArray(user?.roles) ? user.roles.map(norm) : [];
    const pass = hasAny(roles, allowedRoles) && hasAll(roles, requiredRoles);

    if (!pass) return <Navigate to={redirectToForbidden} replace />;
    return children ?? <Outlet />;
}
