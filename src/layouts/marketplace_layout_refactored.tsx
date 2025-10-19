import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

// Layout Components
import Header from "../components/marketplace/layout/Header";
import Sidebar from "../components/marketplace/layout/Sidebar";

// Custom Hooks
import { useProductFilters } from "../hooks/useProductFilters";

// Mock Data
import {
  mockUser,
  mockProductos,
  mockUsuarios,
  mockIncidencias,
} from "@/data/mockData";

// Navigation configuration
import { navigationByRole } from "../lib/navigationConfig";

// Role utilities
import { shouldShowSidebar as checkShouldShowSidebar } from "../lib/roleUtils";

/**
 * MarketplaceLayout - Layout wrapper para las páginas del marketplace
 * Solo contiene la estructura (header, sidebar) y el Outlet para las rutas hijas
 */
const MarketplaceLayout = () => {
  // Determinar si se debe mostrar el sidebar basado en el rol
  const shouldShowSidebar = checkShouldShowSidebar(mockUser.role);
  
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

  const handleLogout = () => {
    console.log("Logout");
    globalThis.location.href = "/login";
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
    mockUser,
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
        mockUser={mockUser}
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
        navigation={
          navigationByRole[mockUser.role as keyof typeof navigationByRole] || navigationByRole.COMPRADOR
        }
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
        userRole={mockUser.role}
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

export default MarketplaceLayout;
