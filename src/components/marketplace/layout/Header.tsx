import { useRef, useEffect } from "react";
import { Search, Menu, User, LogOut, Sun, Moon, X } from "lucide-react";
import type React from "react";

interface User {
  name?: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

interface SearchResult {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  user: User | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
  searchResults: SearchResult[];
  handleSearchSelect: (producto: SearchResult) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
  handleLogout: () => void;
  shouldShowSidebar: boolean;
}

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  theme,
  toggleTheme,
  user,
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  showSearchResults,
  setShowSearchResults,
  searchResults,
  handleSearchSelect,
  handleSearchSubmit,
  showUserMenu,
  setShowUserMenu,
  handleLogout,
  shouldShowSidebar,
}: Readonly<HeaderProps>) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSearchResults, setSearchFocused, setShowUserMenu]);

  // Helper para obtener clases de input
  const getSearchInputClasses = () => {
    const isDark = theme === "dark";
    if (searchFocused) {
      return isDark
        ? "bg-[#1A242F] border-[#FF9900] shadow-lg text-white"
        : "bg-white border-[#FF9900] shadow-lg text-gray-900";
    }
    return isDark
      ? "bg-[#1A242F] border-gray-600 text-white"
      : "bg-white border-gray-400 text-gray-900";
  };

  // Helper para obtener clases de botones
  const getButtonHoverClasses = () => {
    return theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100";
  };

  // Helper para obtener clases de texto
  const getTextClasses = () => {
    return theme === "dark" ? "text-white" : "text-gray-900";
  };

  // Helper para obtener clases de texto secundario
  const getSecondaryTextClasses = () => {
    return theme === "dark" ? "text-gray-400" : "text-gray-600";
  };

  // Helper para obtener clases de dropdown
  const getDropdownClasses = () => {
    return theme === "dark" ? "bg-[#1A242F]" : "bg-white";
  };

  // Helper para obtener clases de hover de item
  const getItemHoverClasses = () => {
    return theme === "dark" ? "hover:bg-[#37475A]" : "hover:bg-[#FFF3E0]";
  };

  return (
    <header className={`sticky top-0 z-30 transition-colors duration-200 shadow-md border-b ${
      theme === "dark" 
        ? "bg-[#131A22] border-gray-800" 
        : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Menu & Logo */}
        <div className="flex items-center gap-4">
          {shouldShowSidebar && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${getButtonHoverClasses()}`}
              aria-label="Toggle sidebar"
            >
              <Menu className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF9900] to-[#CC7A00] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className={`font-bold hidden sm:block text-lg tracking-tight ${getTextClasses()}`}>
              Marketplace
            </span>
          </div>
        </div>

    

        {/* Right side - Theme toggle & User menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-200 ${getButtonHoverClasses()}`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-[#FF9900]" />
            )}
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${getButtonHoverClasses()}`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF9900] to-[#CC7A00] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0) || user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || "U"}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-xl border-2 border-[#FF9900] py-2 z-50 ${getDropdownClasses()}`}>
                <div className={`px-4 py-3 border-b ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}>
                  <p className={`font-semibold ${getTextClasses()}`}>
                    {user?.fullName || user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Usuario"}
                  </p>
                  <p className={`text-sm ${getSecondaryTextClasses()}`}>
                    {user?.email || ""}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full bg-[#FF9900] text-white shadow-sm">
                    {user?.role || "Usuario"}
                  </span>
                </div>

                <div className="py-2">
                  <button className={`w-full px-4 py-2 text-left flex items-center gap-2 font-medium transition-colors duration-200 ${getItemHoverClasses()} ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    <User className="w-4 h-4 text-[#FF9900]" />
                    Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 font-medium transition-colors duration-200 ${
                      theme === "dark" ? "hover:bg-red-900/20" : "hover:bg-red-50"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
