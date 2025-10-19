import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = ({ currentPage, handleNavigation }) => {
  const getBreadcrumbs = () => {
    const breadcrumbMap = {
      dashboard: [{ name: "Dashboard", id: "dashboard" }],
      inicio: [{ name: "Inicio", id: "inicio" }],
      productos: [{ name: "Productos", id: "productos" }],
      favoritos: [{ name: "Favoritos", id: "favoritos" }],
      "mis-productos": [{ name: "Mis Productos", id: "mis-productos" }],
      incidencias: [
        { name: "Moderación", id: "dashboard" },
        { name: "Incidencias", id: "incidencias" },
      ],
      usuarios: [
        { name: "Gestión", id: "dashboard" },
        { name: "Usuarios", id: "usuarios" },
      ],
      configuracion: [
        { name: "Sistema", id: "dashboard" },
        { name: "Configuración", id: "configuracion" },
      ],
      reportes: [
        { name: "Moderación", id: "dashboard" },
        { name: "Reportes", id: "reportes" },
      ],
      mensajes: [{ name: "Mensajes", id: "mensajes" }],
      publicar: [{ name: "Publicar", id: "publicar" }],
      apelaciones: [{ name: "Apelaciones", id: "apelaciones" }],
      moderadores: [
        { name: "Gestión", id: "dashboard" },
        { name: "Moderadores", id: "moderadores" },
      ],
    };

    return (
      breadcrumbMap[currentPage] || [{ name: "Dashboard", id: "dashboard" }]
    );
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => handleNavigation("dashboard")}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          aria-label="Ir al inicio"
        >
          <Home className="w-4 h-4" />
        </button>

        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.id} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-900 dark:text-white">
                {crumb.name}
              </span>
            ) : (
              <button
                onClick={() => handleNavigation(crumb.id)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {crumb.name}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;
