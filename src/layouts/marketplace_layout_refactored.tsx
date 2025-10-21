import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

// Layout Components
import Header from "../components/marketplace/layout/Header";
import Sidebar from "../components/marketplace/layout/Sidebar";

// Custom Hooks
import { useProductFilters } from "../hooks/useProductFilters";
import { useAuth } from "../hooks/use-auth";

// Contexts
import { useFavoritesContext, FavoritesProvider } from "@/context/FavoritesContext";
import { usePublicationsContext, PublicationsProvider } from "@/context/PublicationsContext";

// Mock Data
import {
  mockProductos,
  mockUsuarios,
  mockIncidencias,
} from "@/data/mockData";

// Navigation configuration
import { navigationByRoleExtended } from "../lib/navigationConfig";

// Role utilities
import { shouldShowSidebar as checkShouldShowSidebar, getUserRole } from "../lib/roleUtils";

/**
 * MarketplaceLayoutContent - Componente interno que consume los contexts
 */
const MarketplaceLayoutContent = () => {
  // Obtener el usuario real del backend
  const { user, logout } = useAuth();
  
  // Extraer el rol del usuario
  const userRole = getUserRole(user);
  
  // Determinar si se debe mostrar el sidebar basado en el rol
  const shouldShowSidebar = checkShouldShowSidebar(userRole);

  // Obtener contadores dinámicos desde los contexts (solo datos reales del backend)
  const { favoritesCount } = useFavoritesContext();
  const { totalPublications } = usePublicationsContext();

  // Debug: verificar que los datos lleguen correctamente
  console.log('📊 Badges Debug:', { favoritesCount, totalPublications, userRole });

  // Crear configuración de navegación con badges dinámicos (solo del backend)
  const navigationWithBadges = useMemo(() => {
    const baseNavigation = navigationByRoleExtended[userRole as keyof typeof navigationByRoleExtended] || navigationByRoleExtended.ROLE_BUYER;
    
    console.log('🔧 Creando navigationWithBadges...', { favoritesCount, totalPublications });
    
    // Clonar la navegación y actualizar los badges con datos reales del backend
    return {
      sections: baseNavigation.sections.map(section => ({
        ...section,
        items: section.items.map(item => {
          let badge: number | string | null = null;
          
          // Solo asignar badges que tengan datos reales del backend
          if (item.id === 'favoritos') {
            // Mostrar badge siempre (incluso si es 0)
            badge = favoritesCount;
            console.log(`✅ Badge para favoritos: ${badge}`);
          }
          
          if (item.id === 'publications') {
            // Mostrar total de publicaciones
            badge = totalPublications;
            console.log(`✅ Badge para publications: ${badge}`);
          }
          
          // Para el vendedor, mostrar sus publicaciones
          if (item.id === 'mis-productos') {
            // TODO: Implementar hook useMyPublications() para obtener solo las del vendedor
            badge = null; // Por ahora null hasta que se implemente el hook específico
          }
          
          // Los demás badges permanecen null hasta que se implementen sus respectivos hooks/contexts
          // TODO: Implementar contexto de Mensajes
          // TODO: Implementar contexto de Incidencias
          // TODO: Implementar contexto de Reportes
          // TODO: Implementar contexto de Apelaciones
          
          return { ...item, badge };
        }),
      })),
    };
  }, [userRole, favoritesCount, totalPublications]);
  
  // En desktop, el sidebar debe estar abierto por defecto si el usuario tiene acceso
  const [sidebarOpen, setSidebarOpen] = useState(shouldShowSidebar);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Custom hooks
  const filters = useProductFilters();

  // Data states
  const [productos] = useState(mockProductos);
  const [usuarios] = useState(mockUsuarios);
  const [incidencias] = useState(mockIncidencias);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingIncidencias, setIsLoadingIncidencias] = useState(true);

  // Filter states for Incidencias
  const [filtroEstadoIncidencia, setFiltroEstadoIncidencia] = useState("todos");
  const [filtroPrioridadIncidencia, setFiltroPrioridadIncidencia] =
    useState("todas");
  const [searchIncidencia, setSearchIncidencia] = useState("");

  // Filter states for Reportes
  const [filtroTipoReporte, setFiltroTipoReporte] = useState("todos");
  const [filtroEstadoReporte, setFiltroEstadoReporte] = useState("todos");
  const [searchReporte, setSearchReporte] = useState("");

  // Filter states for Usuarios
  const [filtroRolUsuario, setFiltroRolUsuario] = useState("todos");
  const [filtroEstadoUsuario, setFiltroEstadoUsuario] = useState("todos");
  const [searchUsuario, setSearchUsuario] = useState("");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirigir después de cerrar sesión
      globalThis.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Redirigir de todas formas
      globalThis.location.href = "/login";
    }
  };

  // Simulate data loading
  useEffect(() => {
    filters.setItemsPerPageProducts(9);
    const timer = setTimeout(() => setIsLoadingProducts(false), 1500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingIncidencias(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Toggle favoritos
  const toggleFavorite = (productId: number) => {
    setFavoritos((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  // Helper functions
  const getPrioridadColor = (prioridad: string) => {
    const colors: Record<string, string> = {
      crítica: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      alta: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      media:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      baja: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[prioridad] || colors.media;
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      activo:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactivo: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      agotado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[estado] || colors.inactivo;
  };

  // Search functionality
  const searchResults =
    searchQuery.trim().length >= 2
      ? productos
          .filter(
            (p) =>
              p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  const handleSearchSelect = (producto: any) => {
    console.log("Selected product:", producto);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search submitted:", searchQuery);
      setShowSearchResults(false);
    }
  };

  // Context data para pasar a las páginas hijas
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
    user, // Usuario real del backend
    theme, // Agregar tema al contexto
    // Incidencias filters
    filtroEstadoIncidencia,
    setFiltroEstadoIncidencia,
    filtroPrioridadIncidencia,
    setFiltroPrioridadIncidencia,
    searchIncidencia,
    setSearchIncidencia,
    // Reportes filters
    filtroTipoReporte,
    setFiltroTipoReporte,
    filtroEstadoReporte,
    setFiltroEstadoReporte,
    searchReporte,
    setSearchReporte,
    // Usuarios filters
    filtroRolUsuario,
    setFiltroRolUsuario,
    filtroEstadoUsuario,
    setFiltroEstadoUsuario,
    searchUsuario,
    setSearchUsuario,
  };

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-[#0F151C] text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <Toaster position="top-right" theme={theme} richColors />

      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        theme={theme}
        toggleTheme={toggleTheme}
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
        theme={theme}
      />

      <main 
        className={`pt-16 transition-all duration-300 ease-in-out ${
          shouldShowSidebar && sidebarOpen
            ? "lg:ml-64" 
            : ""
        }`}
      >
        <div className="px-4 md:px-6 lg:px-8 py-6">
          {/* Aquí se renderizan las páginas hijas mediante React Router con datos compartidos */}
          <Outlet context={outletContext} />
        </div>
      </main>

      {shouldShowSidebar && sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden border-none p-0 m-0 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar sidebar"
        />
      )}
    </div>
  );
};

/**
 * MarketplaceLayout - Wrapper con providers
 */
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
