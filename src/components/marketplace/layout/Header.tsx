import { useRef, useEffect } from "react";
import { Search, Menu, User, LogOut, Sun, Moon, X } from "lucide-react";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  theme,
  toggleTheme,
  mockUser,
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
}) => {
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSearchResults, setSearchFocused, setShowUserMenu]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white hidden sm:block">
              Marketplace
            </span>
          </div>
        </div>

        {/* Center - Search bar */}
        <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => {
                setSearchFocused(true);
                if (searchQuery.trim().length >= 2) {
                  setShowSearchResults(true);
                }
              }}
              placeholder="Buscar productos..."
              className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                searchFocused
                  ? "bg-white dark:bg-gray-700 border-blue-500"
                  : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Search results dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
              <div className="p-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
                  {searchResults.length} resultado
                  {searchResults.length !== 1 ? "s" : ""} encontrado
                  {searchResults.length !== 1 ? "s" : ""}
                </p>
                {searchResults.map((producto) => (
                  <button
                    key={producto.id}
                    onClick={() => handleSearchSelect(producto)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <div className="text-3xl">{producto.imagen}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {producto.nombre}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {producto.categoria} • ${producto.precio}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSearchResults &&
            searchQuery.trim().length >= 2 &&
            searchResults.length === 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No se encontraron productos
                </div>
              </div>
            )}
        </div>

        {/* Right side - Theme toggle & User menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {mockUser.name.charAt(0)}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {mockUser.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mockUser.email}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {mockUser.role}
                  </span>
                </div>

                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4" />
                    Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
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
