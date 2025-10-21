import {
  Home,
  ShoppingBag,
  Package,
  AlertTriangle,
  Users,
  Settings,
  LayoutDashboard,
  Store,
  FileText,
  Shield,
  MessageSquare,
  Heart,
} from "lucide-react";

/**
 * Configuración de navegación por rol de usuario
 * Los badges se calculan dinámicamente en el layout usando hooks
 */
export const navigationByRole = {
  COMPRADOR: {
    sections: [
      {
        title: "Principal",
        items: [
          { name: "Inicio", id: "inicio", icon: Home, badge: null },
          {
            name: "Publicaciones",
            id: "publications",
            icon: ShoppingBag,
            badge: null, // Se calcula dinámicamente en el layout
          },
          { name: "Favoritos", id: "favoritos", icon: Heart, badge: null }, // Se calcula dinámicamente
          { name: "Mensajes", id: "mensajes", icon: MessageSquare, badge: null }, // Se calcula dinámicamente
        ],
      },
    ],
  },
  VENDEDOR: {
    sections: [
      {
        title: "Panel",
        items: [
          {
            name: "Dashboard",
            id: "dashboard",
            icon: LayoutDashboard,
            badge: null,
          },
          {
            name: "Mis Publicaciones",
            id: "mis-productos",
            icon: Package,
            badge: null, // Se calcula dinámicamente en el layout
          },
        ],
      },
      {
        title: "Gestión",
        items: [
          { name: "Publicar", id: "publicar", icon: Store, badge: null },
          { name: "Apelaciones", id: "apelaciones", icon: FileText, badge: null }, // Se calcula dinámicamente
          { name: "Mensajes", id: "mensajes", icon: MessageSquare, badge: null }, // Se calcula dinámicamente
        ],
      },
    ],
  },
  MODERADOR: {
    sections: [
      {
        title: "Panel",
        items: [
          {
            name: "Dashboard",
            id: "dashboard",
            icon: LayoutDashboard,
            badge: null,
          },
        ],
      },
      {
        title: "Moderación",
        items: [
          {
            name: "Incidencias",
            id: "incidencias",
            icon: AlertTriangle,
            badge: null, // Se calcula dinámicamente en el layout
          },
          { name: "Reportes", id: "reportes", icon: Shield, badge: null }, // Se calcula dinámicamente en el layout
        ],
      },
      {
        title: "Gestión",
        items: [
          { name: "Usuarios", id: "usuarios", icon: Users, badge: null },
          {
            name: "Publicaciones",
            id: "publications",
            icon: Package,
            badge: null, // Se calcula dinámicamente en el layout
          },
        ],
      },
    ],
  },
  ADMINISTRADOR: {
    sections: [
      {
        title: "Panel",
        items: [
          {
            name: "Dashboard",
            id: "dashboard",
            icon: LayoutDashboard,
            badge: null,
          },
        ],
      },
      {
        title: "Moderación",
        items: [
          {
            name: "Incidencias",
            id: "incidencias",
            icon: AlertTriangle,
            badge: null, // Se calcula dinámicamente en el layout
          },
          { name: "Reportes", id: "reportes", icon: Shield, badge: null }, // Se calcula dinámicamente en el layout
        ],
      },
      {
        title: "Gestión",
        items: [
          {
            name: "Publicaciones",
            id: "publications",
            icon: Package,
            badge: null, // Se calcula dinámicamente en el layout
          },
          { name: "Usuarios", id: "usuarios", icon: Users, badge: null },
          { name: "Moderadores", id: "moderadores", icon: Shield, badge: null },
        ],
      },
      {
        title: "Sistema",
        items: [
          {
            name: "Configuración",
            id: "configuracion",
            icon: Settings,
            badge: null,
          },
        ],
      },
    ],
  },
};

// Agregar alias con formato del backend (ROLE_*)
export const navigationByRoleExtended = {
  ...navigationByRole,
  ROLE_BUYER: navigationByRole.COMPRADOR,
  ROLE_SELLER: navigationByRole.VENDEDOR,
  ROLE_MODERATOR: navigationByRole.MODERADOR,
  ROLE_ADMIN: navigationByRole.ADMINISTRADOR,
};
