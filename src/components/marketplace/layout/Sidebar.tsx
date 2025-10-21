import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type React from "react";
import { shouldShowSidebar as checkShouldShowSidebar } from "@/lib/roleUtils";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number | string | null;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface Navigation {
  sections: NavigationSection[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  navigation: Navigation;
  collapsedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  userRole?: string;
  theme?: "light" | "dark"; // Añadir tema
}

const Sidebar = ({
  sidebarOpen,
  navigation,
  collapsedSections,
  toggleSection,
  userRole = "COMPRADOR",
  theme = "light",
}: Readonly<SidebarProps>) => {
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
    const lastSegment = segments.at(-1);

    // Si el último segmento es 'marketplace-refactored', es la ruta índice
    return lastSegment === "marketplace-refactored" ? "dashboard" : lastSegment;
  };

  const currentPage = getCurrentPage();

  // Debug: verificar navigation con badges
  console.log('🔍 Sidebar Navigation:', navigation);

  // Solo mostrar sidebar para ADMIN y VENDEDOR/SELLER
  // COMPRADOR no tiene acceso al sidebar
  // Usando el sistema de roles centralizado para mayor robustez
  if (!checkShouldShowSidebar(userRole)) {
    return null;
  }

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-40 top-16
      w-64 shadow-xl
      flex flex-col
      h-[calc(100vh-4rem)]
      transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      ${
        theme === "dark"
          ? "bg-[#131A22] border-r border-gray-800"
          : "bg-white border-r border-gray-200"
      }
    `}
    >
      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto p-4 space-y-1 ${
        theme === "dark" 
          ? "scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
          : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      }`}>
        {navigation.sections.map((section) => (
          <div key={section.title} className="mb-4">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.title)}
              className={`flex items-center justify-between w-full px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{section.title}</span>
              {collapsedSections[section.title] ? (
                <ChevronRight className="w-4 h-4 text-[#FF9900]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#FF9900]" />
              )}
            </button>

            {/* Section Items */}
            {!collapsedSections[section.title] && (
              <div className="mt-1 space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  // Determinar clases del link
                  let linkClasses = "";
                  if (isActive) {
                    linkClasses = "bg-[#FF9900] text-white font-bold shadow-lg";
                  } else if (theme === "dark") {
                    linkClasses = "text-gray-300 hover:bg-gray-800 hover:text-white";
                  } else {
                    linkClasses = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
                  }

                  // Determinar clases del icono
                  let iconClasses = "w-5 h-5 flex-shrink-0 ";
                  if (isActive) {
                    iconClasses += "text-white";
                  } else if (theme === "dark") {
                    iconClasses += "text-[#FF9900] group-hover:text-white";
                  } else {
                    iconClasses += "text-[#FF9900] group-hover:text-gray-900";
                  }

                  return (
                    <Link
                      key={item.id}
                      to={`/marketplace-refactored/${item.id === "dashboard" ? "" : item.id}`}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${linkClasses}`}
                    >
                      <Icon className={iconClasses} />
                      <span className="flex-1 text-left font-medium">{item.name}</span>
                      {item.badge !== null && item.badge !== undefined && (
                        <span
                          className={`
                          px-2 py-0.5 text-xs font-bold rounded-full shadow-sm
                          ${
                            isActive
                              ? "bg-white text-[#FF9900]"
                              : "bg-[#FF9900] text-white"
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
      <div className={`p-4 border-t ${
        theme === "dark"
          ? "border-gray-800 bg-[#0A0E14]"
          : "border-gray-200 bg-gray-50"
      }`}>
        <div className={`text-xs text-center ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>
          <p className="font-bold text-[#FF9900]">Marketplace v1.0</p>
          <p className="mt-1">© 2025 Todos los derechos reservados</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
