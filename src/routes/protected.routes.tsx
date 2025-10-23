import MarketplaceLayout from "@/layouts/MarketplaceLayout.tsx";
import RoleBasedHome from "@/routes/role-based-home";
import roleService from "@/services/roles/role.service.ts";
import Profile from "@/pages/Profile";

import {
  DashboardPage,
  PublicationsPage,
  PublicationDetailPage,
  FavoritosPage,
  UsuariosPage,
  ConfiguracionPage,
  ReportesPage,
  MensajesPage,
  ApelacionesPage,
  ModeradoresPage,
} from "@/pages/marketplace";
import VendorProductsPage from "@/pages/marketplace/VendorProductsPage";
import PublicationFormPage from "@/pages/marketplace/PublicationFormPage";
import IncidenceDetailPage from "@/pages/marketplace/incidences/IncidenceDetailPage";
import AppealPage from "@/pages/marketplace/appeals/AppealPage";
import IncidencesPage from "@/pages/marketplace/incidences/IncidencesPage";
import MyAppealsPage from "@/pages/marketplace/appeals/MyAppealsPage";
import AppealDetailPage from "@/pages/marketplace/appeals/AppealDetailPage";

const BUYER_SELLER = [roleService.getRoleBuyer(), roleService.getRoleSeller()];
const SELLER = [roleService.getRoleSeller()];
const STAFF = [
  roleService.getRoleModerator(),
  roleService.getRoleAdmin(),
  roleService.getRoleSuperAdmin(),
];
const ADMINS = [roleService.getRoleAdmin(), roleService.getRoleSuperAdmin()];

export const protectedRoutes = [
  {
    protected: true,
    path: "/marketplace-refactored",
    layout: <MarketplaceLayout />,
    children: [
      // Default route: redirects user based on their role
      { index: true, element: <RoleBasedHome /> },

      // General access (any authenticated user)
      { path: "publications", element: <PublicationsPage /> },
      { path: "publication/:id", element: <PublicationDetailPage /> },
      { path: "profile", element: <Profile /> },
      { path: "favoritos", element: <FavoritosPage /> },

      // Buyer + Seller access
      {
        path: "favoritos",
        element: <FavoritosPage />,
        allowedRoles: BUYER_SELLER,
      },
      {
        path: "mensajes",
        element: <MensajesPage />,
        allowedRoles: BUYER_SELLER,
      },

      // Seller-only access
      {
        path: "mis-productos",
        element: <VendorProductsPage />,
        allowedRoles: SELLER,
      },
      {
        path: "publicar",
        element: <PublicationFormPage />,
        allowedRoles: SELLER,
      },
      {
        path: "editar/:id",
        element: <PublicationFormPage />,
        allowedRoles: SELLER,
      },
      {
        path: "publish",
        element: <PublicationFormPage />,
        allowedRoles: SELLER,
      },

      // Staff access (Moderator + Admin + SuperAdmin)

      { path: "usuarios", element: <UsuariosPage />, allowedRoles: STAFF },
      { path: "dashboard", element: <DashboardPage />, allowedRoles: STAFF },
      { path: "apelaciones", element: <MyAppealsPage />, allowedRoles: STAFF },
      {
        path: "apelaciones/:appealId",
        element: <AppealDetailPage />,
        allowedRoles: STAFF,
      },

      // Admin / SuperAdmin access only
      {
        path: "moderadores",
        element: <ModeradoresPage />,
        allowedRoles: ADMINS,
      },
      {
        path: "incidencias",
        element: <IncidencesPage />,
        allowedRoles: STAFF,
      },
      {
        path: "incidencias/:publicUi",
        element: <IncidenceDetailPage />,
        allowedRoles: STAFF,
      },
      {
        path: "incidencias/:publicUi/apelacion",
        element: <AppealPage />,
        allowedRoles: SELLER,
      },
      {
        path: "configuracion",
        element: <ConfiguracionPage />,
        allowedRoles: ADMINS,
      },
    ],
  },
];
