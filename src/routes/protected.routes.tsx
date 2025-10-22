import MarketplaceLayout from "@/layouts/marketplace_layout_refactored";
import RoleBasedHome from "@/routes/role-based-home";
import roleService from "@/services/role.service";
import Profile from "@/pages/Profile";

import {
  DashboardPage, ProductsPage, PublicationsPage, PublicationDetailPage,
  FavoritosPage, UsuariosPage, ConfiguracionPage, IncidenciasPage,
  ReportesPage, MensajesPage, ApelacionesPage, ModeradoresPage
} from "@/pages/marketplace";
import ProductDetailPage from "@/pages/marketplace/ProductDetailPage";
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
    { path: "productos", element: <ProductsPage /> },
    { path: "producto/:id", element: <ProductDetailPage /> },
    { path: "publications", element: <PublicationsPage /> },
    { path: "publication/:id", element: <PublicationDetailPage /> },
    { path: "profile", element: <Profile /> },

    // Buyer + Seller access
    { path: "favoritos", element: <FavoritosPage />, allowedRoles: BUYER_SELLER },
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
