import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/marketplace/layout/Header";
import Sidebar from "../components/marketplace/layout/Sidebar";
import { useProductFilters } from "../hooks/useProductFilters";
import { useAuth } from "../hooks/use-auth";
import { useFavoritesContext, FavoritesProvider } from "@/context/FavoritesContext";
import { usePublicationsContext, PublicationsProvider } from "@/context/PublicationsContext";
import { mockProductos, mockUsuarios, mockIncidencias } from "@/data/mockData";
import { navigationByRoleExtended } from "../lib/navigationConfig";
import { shouldShowSidebar as checkShouldShowSidebar, getUserRole } from "../lib/roleUtils";
import { useTheme } from "next-themes";

const MarketplaceLayoutContent = () => {
  const { user, logout } = useAuth();
  const userRole = getUserRole(user);
  const shouldShowSidebar = checkShouldShowSidebar(userRole);
  const { favoritesCount } = useFavoritesContext();
  const { totalPublications } = usePublicationsContext();

  const navigationWithBadges = useMemo(() => {
    const baseNavigation = navigationByRoleExtended[userRole as keyof typeof navigationByRoleExtended] || navigationByRoleExtended.ROLE_BUYER;
    return {
      sections: baseNavigation.sections.map(section => ({
        ...section,
        items: section.items.map(item => {
          let badge: number | string | null = null;
          if (item.id === "favoritos") badge = favoritesCount;
          if (item.id === "publications") badge = totalPublications;
          if (item.id === "mis-productos") badge = null;
          return { ...item, badge };
        }),
      })),
    };
  }, [userRole, favoritesCount, totalPublications]);

  const [sidebarOpen, setSidebarOpen] = useState(shouldShowSidebar);
  const { theme: themeSetting, resolvedTheme } = useTheme();
  const activeTheme = (themeSetting === "system" ? resolvedTheme : themeSetting) === "dark" ? "dark" : "light";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const filters = useProductFilters();
  const [productos] = useState(mockProductos);
  const [usuarios] = useState(mockUsuarios);
  const [incidencias] = useState(mockIncidencias);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingIncidencias, setIsLoadingIncidencias] = useState(true);

  const [filtroEstadoIncidencia, setFiltroEstadoIncidencia] = useState("todos");
  const [filtroPrioridadIncidencia, setFiltroPrioridadIncidencia] = useState("todas");
  const [searchIncidencia, setSearchIncidencia] = useState("");

  const [filtroTipoReporte, setFiltroTipoReporte] = useState("todos");
  const [filtroEstadoReporte, setFiltroEstadoReporte] = useState("todos");
  const [searchReporte, setSearchReporte] = useState("");

  const [filtroRolUsuario, setFiltroRolUsuario] = useState("todos");
  const [filtroEstadoUsuario, setFiltroEstadoUsuario] = useState("todos");
  const [searchUsuario, setSearchUsuario] = useState("");

  const toggleSection = (section: string) => setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));

  const handleLogout = async () => {
    try {
      await logout();
      globalThis.location.href = "/login";
    } catch {
      globalThis.location.href = "/login";
    }
  };

  useEffect(() => {
    filters.setItemsPerPageProducts(9);
    const t = setTimeout(() => setIsLoadingProducts(false), 1500);
    return () => clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoadingIncidencias(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const toggleFavorite = (productId: number) => {
    setFavoritos(prev => (prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]));
  };

  const getPrioridadColor = (prioridad: string) => {
    const colors: Record<string, string> = {
      crítica: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      alta: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      baja: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[prioridad] || colors.media;
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      activo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactivo: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      agotado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[estado] || colors.inactivo;
  };

  const searchResults =
    searchQuery.trim().length >= 2
      ? productos
        .filter(
          p =>
            p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 6)
      : [];

  const handleSearchSelect = (producto: any) => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) setShowSearchResults(false);
  };

  const outletContext = {
    productos,
    usuarios,
    incidencias,
    favoritos,
    filters,
    isLoadingProducts,
    isLoadingIncidencias,
    getPrioridadColor,
    getEstadoColor,
    toggleFavorite,
    user,
    theme: activeTheme,
    filtroEstadoIncidencia,
    setFiltroEstadoIncidencia,
    filtroPrioridadIncidencia,
    setFiltroPrioridadIncidencia,
    searchIncidencia,
    setSearchIncidencia,
    filtroTipoReporte,
    setFiltroTipoReporte,
    filtroEstadoReporte,
    setFiltroEstadoReporte,
    searchReporte,
    setSearchReporte,
    filtroRolUsuario,
    setFiltroRolUsuario,
    filtroEstadoUsuario,
    setFiltroEstadoUsuario,
    searchUsuario,
    setSearchUsuario,
  };

  return (
    <div className={`min-h-screen ${activeTheme === "dark" ? "bg-[#0F151C] text-white" : "bg-gray-50 text-gray-900"}`}>
      <Toaster position="top-right" theme={activeTheme} richColors />

      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        theme={activeTheme}
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
        searchResults={searchResults}
        handleSearchSelect={handleSearchSelect}
        handleSearchSubmit={handleSearchSubmit}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        handleLogout={handleLogout}
        shouldShowSidebar={shouldShowSidebar}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        navigation={navigationWithBadges}
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
        userRole={userRole}
        theme={activeTheme}
      />

      <main
        className={`pt-2 transition-all duration-300 ease-in-out ${
          shouldShowSidebar && sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <div className="mx-auto w-full sm:max-w-full md:max-w-[90vw] lg:max-w-[80vw] px-6 md:px-8 lg:px-12 py-6">
          <Outlet context={outletContext} />
        </div>
      </main>

      {shouldShowSidebar && sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 lg:hidden backdrop-blur-sm bg-transparent border-none p-0 m-0 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar sidebar"
        />
      )}
    </div>
  );
};

const MarketplaceLayout = () => {
  return (
    <PublicationsProvider>
      <FavoritesProvider>
        <MarketplaceLayoutContent />
      </FavoritesProvider>
    </PublicationsProvider>
  );
};

export default MarketplaceLayout;
