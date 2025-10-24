import MarketplaceLayout from "@/layouts/MarketplaceLayout.tsx";
import RoleBasedHome from "@/routes/role-based-home";
import roleService from "@/services/roles/role.service.ts";
import Profile from "@/pages/Profile";

import {
  DashboardPage, PublicationsPage, PublicationDetailPage,
  FavoritosPage, UsuariosPage, ConfiguracionPage, IncidenciasPage,
  ReportesPage, MensajesPage, ApelacionesPage, ModeradoresPage
} from "@/pages/marketplace";
import VendorProductsPage from "@/pages/marketplace/VendorProductsPage";
import PublicationFormPage from "@/pages/marketplace/PublicationFormPage";

const BUYER_SELLER = [ roleService.getRoleBuyer(), roleService.getRoleSeller() ];
const SELLER       = [ roleService.getRoleSeller() ];
const STAFF        = [ roleService.getRoleModerator(), roleService.getRoleAdmin(), roleService.getRoleSuperAdmin() ];
const ADMINS       = [ roleService.getRoleAdmin(), roleService.getRoleSuperAdmin() ];

export const protectedRoutes = [{
  protected: true,
  path: "/marketplace-refactored",
  layout: <MarketplaceLayout />,
  children: [
    // Default route: redirects user based on their role
    { index: true, element: <RoleBasedHome /> },

    // General access (any authenticated user)
    { path: "publications", element: <PublicationsPage /> },
    { path: "publication/:id", element: <PublicationDetailPage /> },
    { path: "favoritos", element: <FavoritosPage /> },
    { path: "profile", element: <Profile /> },

    // Buyer + Seller access
    { path: "mensajes",  element: <MensajesPage  />, allowedRoles: BUYER_SELLER },

    // Seller-only access
    { path: "mis-productos", element: <VendorProductsPage   />, allowedRoles: SELLER },
    { path: "publicar",      element: <PublicationFormPage  />, allowedRoles: SELLER },
    { path: "editar/:id",    element: <PublicationFormPage  />, allowedRoles: SELLER },
    { path: "publish",       element: <PublicationFormPage  />, allowedRoles: SELLER },
    { path: "apelaciones",   element: <ApelacionesPage      />, allowedRoles: SELLER },

    // Staff access (Moderator + Admin + SuperAdmin)
    { path: "incidencias", element: <IncidenciasPage />, allowedRoles: STAFF },
    { path: "usuarios",    element: <UsuariosPage    />, allowedRoles: STAFF },
    { path: "dashboard",   element: <DashboardPage   />, allowedRoles: STAFF },
    { path: "reportes",  element: <ReportesPage  />, allowedRoles: STAFF },

    // Admin / SuperAdmin access only
    { path: "moderadores",  element: <ModeradoresPage   />, allowedRoles: ADMINS },
    { path: "configuracion",element: <ConfiguracionPage />, allowedRoles: ADMINS },
  ],
}];
