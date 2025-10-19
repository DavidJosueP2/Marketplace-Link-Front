import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({
  sidebarOpen,
  navigation,
  collapsedSections,
  toggleSection,
}) => {
  const location = useLocation();

  // Extraer la página actual de la URL
  const getCurrentPage = () => {
    const path = location.pathname;

    // Si es la ruta base /marketplace-refactored o /marketplace-refactored/
    if (
      path === "/marketplace-refactored" ||
      path === "/marketplace-refactored/"
    ) {
      return "dashboard";
    }

    // Extraer el último segmento (productos, favoritos, etc.)
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // Si el último segmento es 'marketplace-refactored', es la ruta índice
    return lastSegment === "marketplace-refactored" ? "dashboard" : lastSegment;
  };

  const currentPage = getCurrentPage();

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-40 top-16
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      transition-transform duration-300 ease-in-out
      w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
      flex flex-col
      ${sidebarOpen ? "h-[calc(100vh-4rem)]" : "lg:h-[calc(100vh-4rem)]"}
    `}
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.sections.map((section) => (
          <div key={section.title} className="mb-4">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span>{section.title}</span>
              {collapsedSections[section.title] ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Section Items */}
            {!collapsedSections[section.title] && (
              <div className="mt-1 space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <Link
                      key={item.id}
                      to={`/marketplace-refactored/${item.id === "dashboard" ? "" : item.id}`}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}
                      />
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.badge !== null && item.badge !== undefined && (
                        <span
                          className={`
                          px-2 py-0.5 text-xs font-medium rounded-full
                          ${
                            isActive
                              ? "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }
                        `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Marketplace v1.0</p>
          <p className="mt-1">© 2025 Todos los derechos reservados</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
