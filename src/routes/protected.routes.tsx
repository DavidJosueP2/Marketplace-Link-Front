import AuthLayout from "@/layouts/AuthLayout";
import MarketplaceLayout from "@/layouts/marketplace_layout_refactored";
import RoleBasedHome from "@/routes/role-based-home";
import roleService from "@/services/role.service";
import Profile from "@/pages/Profile";

// Marketplace Pages
import {
  DashboardPage,
  PublicationsPage,
  PublicationDetailPage,
  FavoritosPage,
  UsuariosPage,
  ConfiguracionPage,
  IncidenciasPage,
  ReportesPage,
  MensajesPage,
  ApelacionesPage,
  ModeradoresPage,
} from "@/pages/marketplace";
import VendorProductsPage from "@/pages/marketplace/VendorProductsPage";
import PublicationFormPage from "@/pages/marketplace/PublicationFormPage";
import IncidencesPage from "@/pages/marketplace/incidences/IncidencesPage";
import { Path } from "leaflet";
import IncidenceDetailPage from "@/pages/marketplace/incidences/IncidenceDetailPage";

export const protectedRoutes = [
  {
    protected: true,
    path: "/marketplace-refactored",
    allowedRoles: [roleService.getRoleAdmin(), roleService.getRoleModerator()],
    element: <MarketplaceLayout />,
    layout: null,
    children: [
      { path: "incidencias", element: <IncidencesPage /> },
      { path: "incidencias/:publicUi", element: <IncidenceDetailPage /> },
      //{ path: "apelaciones", element: <ApelacionesPage /> },
      //  { path: "/admin/dashboard", element: <DashboardPage /> },
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
      { path: "/profile", element: <Profile /> },
    ],
  },
  // Marketplace Refactored Routes - Cada página tiene su propia ruta
  {
    protected: false,
    path: "/marketplace-refactored",
    element: <MarketplaceLayout />,
    layout: null,
    children: [
      { index: true, element: <PublicationsPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "publications", element: <PublicationsPage /> },
      { path: "publication/:id", element: <PublicationDetailPage /> },
      { path: "favoritos", element: <FavoritosPage /> },
      { path: "mis-productos", element: <VendorProductsPage /> },
      { path: "publicar", element: <PublicationFormPage /> },
      { path: "editar/:id", element: <PublicationFormPage /> },
      { path: "publish", element: <PublicationFormPage /> },
      { path: "mensajes", element: <MensajesPage /> },
      { path: "usuarios", element: <UsuariosPage /> },
      { path: "configuracion", element: <ConfiguracionPage /> },
      { path: "profile", element: <Profile /> },
    ],
  },
];
