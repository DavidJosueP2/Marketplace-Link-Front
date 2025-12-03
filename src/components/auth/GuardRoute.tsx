import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.ts";

const norm = (r: string | { name?: string } | null | undefined): string =>
  String(r && typeof r === "object" ? r.name || "" : r || "")
    .trim()
    .toUpperCase();

const hasAny = (userRoles: string[], allowed: readonly (string | { name?: string })[] = []): boolean =>
  !allowed?.length || allowed.some((r) => userRoles.includes(norm(r)));

const hasAll = (userRoles: string[], required: readonly (string | { name?: string })[] = []): boolean =>
  !required?.length || required.every((r) => userRoles.includes(norm(r)));

interface GuardRouteProps {
  readonly allowedRoles?: readonly (string | { name?: string })[];
  readonly requiredRoles?: readonly (string | { name?: string })[];
  readonly redirectToLogin?: string;
  readonly redirectToForbidden?: string;
  readonly fallback?: React.ReactNode;
  readonly children?: React.ReactNode;
}

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
}: GuardRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <>{fallback}</>;
  if (!isAuthenticated)
    return <Navigate to={redirectToLogin} replace />;

  const roles = Array.isArray(user?.roles)
    ? user.roles.map((r: string | { name?: string }) => {
        const roleName = typeof r === "string" ? r : r?.name || "";
        return norm(roleName);
      })
    : [];

  const pass = hasAny(roles, allowedRoles) && hasAll(roles, requiredRoles);

  if (!pass) return <Navigate to={redirectToForbidden} replace />;

  return <>{children ?? <Outlet />}</>;
}