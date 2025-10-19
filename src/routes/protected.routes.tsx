import AuthLayout from "@/layouts/AuthLayout";
import MarketplaceLayout from "@/layouts/marketplace_layout_refactored";
import RoleBasedHome from "@/routes/role-based-home";
import roleService from "@/services/role.service";

// Marketplace Pages
import {
  DashboardPage,
  ProductsPage,
  FavoritosPage,
  MisProductosPage,
  UsuariosPage,
  ConfiguracionPage,
  IncidenciasPage,
  PublicarPage,
  ReportesPage,
  MensajesPage,
  ApelacionesPage,
  ModeradoresPage,
} from "@/pages/marketplace";

export const protectedRoutes = [
  {
    protected: true,
    allowedRoles: [roleService.getRoleAdmin()],
    layout: <AuthLayout />,
    children: [
      // { path: "/admin/dashboard", element: <DashboardPage /> },
      // Ejemplo: esta ruta puede ser accedida tanto por ADMIN como por MODERATOR
      // { path: "/admin/users", element: <UsersPage />, allowedRoles: ["ADMIN", "MODERATOR"] },
    ],
  },
  {
    protected: true,
    allowedRoles: [roleService.getRoleModerator()],
    layout: <AuthLayout />,
    children: [
      // { path: "/moderator/panel", element: <ModeratorPanel /> },
    ],
  },
  {
    protected: true,
    allowedRoles: [roleService.getRoleBuyer()],
    layout: <AuthLayout />,
    children: [
      // { path: "/shop", element: <ShopPage /> },
    ],
  },
  {
    protected: true,
    allowedRoles: [roleService.getRoleSeller()],
    layout: <AuthLayout />,
    children: [
      // { path: "/sales", element: <SalesPage /> },
    ],
  },
  {
    protected: true,
    layout: <AuthLayout />,
    children: [
      { index: true, element: <RoleBasedHome /> },
      // { path: "/profile", element: <ProfilePage /> },
    ],
  },
  // Marketplace Refactored Routes - Cada página tiene su propia ruta
  {
    protected: false,
    path: "/marketplace-refactored",
    element: <MarketplaceLayout />,
    layout: null,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "productos", element: <ProductsPage /> },
      { path: "favoritos", element: <FavoritosPage /> },
      { path: "mis-productos", element: <MisProductosPage /> },
      { path: "publicar", element: <PublicarPage /> },
      { path: "mensajes", element: <MensajesPage /> },
      { path: "usuarios", element: <UsuariosPage /> },
      { path: "incidencias", element: <IncidenciasPage /> },
      { path: "reportes", element: <ReportesPage /> },
      { path: "apelaciones", element: <ApelacionesPage /> },
      { path: "moderadores", element: <ModeradoresPage /> },
      { path: "configuracion", element: <ConfiguracionPage /> },
    ],
  },
];
