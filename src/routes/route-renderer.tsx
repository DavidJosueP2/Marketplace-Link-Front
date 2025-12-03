import React, { Suspense } from "react";
import { Route, Navigate } from "react-router-dom";
import { GuardRoute } from "@/components/auth/GuardRoute.tsx";
import CenteredSpinner from "@/components/ui/CenteredSpinner.tsx";

interface RouteGuard {
  protected?: boolean;
  allowedRoles?: string[];
  requiredRoles?: string[];
}

interface RouteNode {
  path?: string;
  index?: boolean;
  element?: React.ReactElement;
  layout?: React.ReactElement | null;
  redirect?: string;
  children?: RouteNode[];
  protected?: boolean;
  allowedRoles?: string[];
  requiredRoles?: string[];
}

function withLayout(element: React.ReactElement | null, layout?: React.ReactElement | null) {
  return layout ? React.cloneElement(layout, {}, element) : element;
}

function withGuards(element: React.ReactElement | null, guard: RouteGuard) {
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

function mergeGuard(parent: RouteGuard = {}, node: RouteGuard = {}): RouteGuard {
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

function renderNode(node: RouteNode, keyPrefix = "", parentGuard: RouteGuard = {}) {
  const key = `${keyPrefix}${node.path || node.index ? node.path || "index" : "group"}`;

  if (node.redirect) {
    return (
      <Route
        key={key}
        path={node.path}
        element={<Navigate to={node.redirect} replace />}
      />
    );
  }

  const base = node.element ? (
    <Suspense fallback={<CenteredSpinner />}>
      {node.element}
    </Suspense>
  ) : null;

  const guard = mergeGuard(parentGuard, node);
  const guarded = withGuards(base, guard);
  const wrapped = withLayout(guarded, node.layout);

  if (node.children?.length) {
    return (
      <Route key={key} path={node.path} element={wrapped}>
        {node.children.map((child, index) =>
          renderNode(child, `${key}-${index}-`, guard),
        )}
      </Route>
    );
  }

  if (node.index) return <Route key={key} index element={wrapped} />;
  return <Route key={key} path={node.path} element={wrapped} />;
}

export function renderRoutes(routes: RouteNode[]) {
  return routes.map((r, i) => renderNode(r, `r${i}-`));
}
