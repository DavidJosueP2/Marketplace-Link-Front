// src/components/auth/can-render.tsx
import React from "react";
import { useAuth } from "@/hooks/use-auth.ts";

const norm = (r: string | { name?: string } | null | undefined): string =>
  String(r && typeof r === "object" ? r.name || "" : r || "")
    .trim()
    .toUpperCase();

interface CanRenderProps {
  readonly allowedRoles?: readonly (string | { name?: string })[];
  readonly requiredRoles?: readonly (string | { name?: string })[];
  readonly children: React.ReactNode;
}

export default function CanRender({
  allowedRoles = [],
  requiredRoles = [],
  children,
}: CanRenderProps) {
  const { user } = useAuth();
  const roles = Array.isArray(user?.roles) ? user.roles.map(norm) : [];
  const passAny =
    !allowedRoles.length || allowedRoles.some((r) => roles.includes(norm(r)));
  const passAll =
    !requiredRoles.length ||
    requiredRoles.every((r) => roles.includes(norm(r)));
  if (!passAny || !passAll) return null;
  return <>{children}</>;
}
