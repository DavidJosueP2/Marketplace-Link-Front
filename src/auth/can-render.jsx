// src/components/auth/can-render.jsx
import React from "react";
import { useAuth } from "@/hooks/use-auth.js";

const norm = (r) => String(r || "").trim().toUpperCase();

export default function CanRender({ allowedRoles = [], requiredRoles = [], children }) {
    const { user } = useAuth();
    const roles = Array.isArray(user?.roles) ? user.roles.map(norm) : [];
    const passAny = !allowedRoles.length || allowedRoles.some((r) => roles.includes(norm(r)));
    const passAll = !requiredRoles.length || requiredRoles.every((r) => roles.includes(norm(r)));
    if (!passAny || !passAll) return null;
    return <>{children}</>;
}
