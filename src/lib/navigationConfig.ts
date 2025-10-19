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
  Search,
} from "lucide-react";
import { mockIncidencias, mockProductos } from "@/data/mockData";

/**
 * Configuración de navegación por rol de usuario
 */
export const navigationByRole = {
  COMPRADOR: {
    sections: [
      {
        title: "Principal",
        items: [
          { name: "Inicio", id: "inicio", icon: Home, badge: null },
          {
            name: "Productos",
            id: "productos",
            icon: ShoppingBag,
            badge: mockProductos.length,
          },
          { name: "Favoritos", id: "favoritos", icon: Heart, badge: 0 },
          { name: "Mensajes", id: "mensajes", icon: MessageSquare, badge: 3 },
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
            name: "Mis Productos",
            id: "mis-productos",
            icon: Package,
            badge: mockProductos.length,
          },
        ],
      },
      {
        title: "Gestión",
        items: [
          { name: "Publicar", id: "publicar", icon: Store, badge: null },
          { name: "Apelaciones", id: "apelaciones", icon: FileText, badge: 2 },
          { name: "Mensajes", id: "mensajes", icon: MessageSquare, badge: 5 },
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
            badge: mockIncidencias.filter((i) => i.estado === "pendiente")
              .length,
          },
          { name: "Reportes", id: "reportes", icon: Shield, badge: 8 },
        ],
      },
      {
        title: "Gestión",
        items: [
          { name: "Usuarios", id: "usuarios", icon: Users, badge: null },
          {
            name: "Productos",
            id: "productos",
            icon: Package,
            badge: mockProductos.length,
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
            badge: mockIncidencias.filter((i) => i.estado === "pendiente")
              .length,
          },
          { name: "Reportes", id: "reportes", icon: Shield, badge: 8 },
        ],
      },
      {
        title: "Gestión",
        items: [
          {
            name: "Productos",
            id: "productos",
            icon: Package,
            badge: mockProductos.length,
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
