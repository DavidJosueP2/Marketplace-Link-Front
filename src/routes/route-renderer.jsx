import React from "react";
import { Route, Navigate } from "react-router-dom";
import { GuardRoute } from "@/auth/GuardRoute.jsx";

function withLayout(element, layout) {
    return layout ? React.cloneElement(layout, {}, element) : element;
}

function withGuards(element, guard) {
    const isProtected =
        guard.protected ||
        (guard.allowedRoles?.length ?? 0) > 0 ||
        (guard.requiredRoles?.length ?? 0) > 0;

    if (!isProtected) return element;

    return (
        <GuardRoute
            allowedRoles={guard.allowedRoles}
            requiredRoles={guard.requiredRoles}
        >
            {element}
        </GuardRoute>
    );
}

function mergeGuard(parent = {}, node = {}) {
    return {
        protected:
            !!parent.protected ||
            !!node.protected ||
            (node.allowedRoles?.length ?? 0) > 0 ||
            (node.requiredRoles?.length ?? 0) > 0,
        allowedRoles: node.allowedRoles ?? parent.allowedRoles,
        requiredRoles: [
            ...(parent.requiredRoles ?? []),
            ...(node.requiredRoles ?? []),
        ],
    };
}

function renderNode(node, keyPrefix = "", parentGuard = {}) {
    const key = `${keyPrefix}${node.path || node.index ? node.path || "index" : "group"}`;

    if (node.redirect) {
        return <Route key={key} path={node.path} element={<Navigate to={node.redirect} replace />} />;
    }

    const base = node.element ?? null;
    const guard = mergeGuard(parentGuard, node);
    const guarded = withGuards(base, guard);
    const wrapped = withLayout(guarded, node.layout);

    if (node.children?.length) {
        return (
            <Route key={key} element={wrapped}>
                {node.children.map((child, i) => renderNode(child, `${key}-`, guard))}
            </Route>
        );
    }

    if (node.index) return <Route key={key} index element={wrapped} />;
    return <Route key={key} path={node.path} element={wrapped} />;
}

export function renderRoutes(routes) {
    return routes.map((r, i) => renderNode(r, `r${i}-`));
}
