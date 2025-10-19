import { Package, ShoppingBag, AlertTriangle, Shield } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import {
  getCardWithShadowClasses,
  getTextSecondaryClasses,
  getTextPrimaryClasses,
  getBorderClasses,
  getSkeletonClasses,
  getProgressBarClasses,
} from "@/lib/themeHelpers";

/**
 * DashboardPage - Página principal con estadísticas y resumen
 */
const DashboardPage = () => {
  // Obtener datos del layout mediante useOutletContext
  const {
    productos = [],
    incidencias = [],
    isLoadingProducts = false,
    isLoadingIncidencias = false,
    getPrioridadColor,
    theme = "light",
  } = useOutletContext<{
    productos: any[];
    incidencias: any[];
    isLoadingProducts: boolean;
    isLoadingIncidencias: boolean;
    getPrioridadColor: (prioridad: string) => string;
    theme: "light" | "dark";
  }>();

  // Estadísticas calculadas
  const stats = {
    totalProductos: productos.length,
    productosActivos: productos.filter((p) => p.estado === "activo").length,
    incidenciasPendientes: incidencias.filter((i) => i.estado === "pendiente")
      .length,
    incidenciasCriticas: incidencias.filter((i) => i.prioridad === "crítica")
      .length,
  };

  // Categorías para el gráfico
  const categorias = ["Electrónica", "Deportes", "Videojuegos"];
  const categoriaStats = categorias.map((cat) => ({
    nombre: cat,
    cantidad: productos.filter((p) => p.categoria === cat).length,
    porcentaje:
      productos.length > 0
        ? (productos.filter((p) => p.categoria === cat).length /
            productos.length) *
          100
        : 0,
  }));

  // Obtener clases del tema
  const cardClasses = getCardWithShadowClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const textPrimary = getTextPrimaryClasses(theme);
  const borderClass = getBorderClasses(theme);
  const skeletonClass = getSkeletonClasses(theme);
  const { track: progressTrack, fill: progressFill } = getProgressBarClasses(theme);

  return (
    <div>
      {isLoadingProducts ? (
        <>
          {/* Skeleton loader */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={`skeleton-stat-${i}`}
                className={`${cardClasses} ${skeletonClass} p-6 h-24`}
              />
            ))}
          </div>

          {/* Skeletons para secciones de contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={cardClasses}>
              <div className={`h-6 ${skeletonClass} rounded w-48 mb-4`}></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={`skeleton-incident-${i}`}
                    className={`flex items-start gap-3 pb-3 border-b ${borderClass} last:border-0`}
                  >
                    <div className={`w-5 h-5 ${skeletonClass} rounded`}></div>
                    <div className="flex-1">
                      <div className={`h-4 ${skeletonClass} rounded w-3/4 mb-2`}></div>
                      <div className={`h-3 ${skeletonClass} rounded w-1/2`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={cardClasses}>
              <div className={`h-6 ${skeletonClass} rounded w-48 mb-4`}></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={`skeleton-category-${i}`}>
                    <div className="flex justify-between text-sm mb-1">
                      <div className={`h-4 ${skeletonClass} rounded w-24`}></div>
                      <div className={`h-4 ${skeletonClass} rounded w-8`}></div>
                    </div>
                    <div className={`w-full ${progressTrack} rounded-full h-2`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
            <div className={cardClasses}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${textSecondary} text-sm`}>
                    Total Productos
                  </p>
                  <p className={`${textPrimary} text-2xl font-bold mt-2`}>
                    {stats.totalProductos}
                  </p>
                </div>
                <Package className="text-[#FF9900]" size={32} />
              </div>
            </div>

            <div className={cardClasses}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${textSecondary} text-sm`}>
                    Activos
                  </p>
                  <p className={`${textPrimary} text-2xl font-bold mt-2`}>
                    {stats.productosActivos}
                  </p>
                </div>
                <ShoppingBag className="text-green-600" size={32} />
              </div>
            </div>

            <div className={cardClasses}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${textSecondary} text-sm`}>
                    Incidencias
                  </p>
                  <p className={`${textPrimary} text-2xl font-bold mt-2`}>
                    {stats.incidenciasPendientes}
                  </p>
                </div>
                <AlertTriangle className="text-yellow-600" size={32} />
              </div>
            </div>

            <div className={cardClasses}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${textSecondary} text-sm`}>
                    Críticas
                  </p>
                  <p className={`${textPrimary} text-2xl font-bold mt-2`}>
                    {stats.incidenciasCriticas}
                  </p>
                </div>
                <Shield className="text-red-600" size={32} />
              </div>
            </div>
          </div>

          {/* Secciones de contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incidencias Recientes */}
            <div
              className={`${cardClasses} ${isLoadingIncidencias ? "" : "animate-fade-in"}`}
            >
              <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>
                Incidencias Recientes
              </h3>
              <div className="space-y-3">
                {isLoadingIncidencias ? (
                  <>
                    {Array.from({ length: 4 }, (_, i) => (
                      <div
                        key={`loading-incident-${i}`}
                        className={`flex items-start gap-3 pb-3 border-b ${borderClass} last:border-0`}
                      >
                        <div className={`w-5 h-5 ${skeletonClass} rounded`}></div>
                        <div className="flex-1">
                          <div className={`h-4 ${skeletonClass} rounded w-3/4 mb-2`}></div>
                          <div className={`h-3 ${skeletonClass} rounded w-1/2`}></div>
                        </div>
                        <div className={`h-6 w-16 ${skeletonClass} rounded`}></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {incidencias.length === 0 ? (
                      <p className={`${textSecondary} text-center py-8`}>
                        No hay incidencias recientes
                      </p>
                    ) : (
                      incidencias.slice(0, 4).map((inc) => (
                        <div
                          key={inc.id}
                          className={`flex items-start gap-3 pb-3 border-b ${borderClass} last:border-0`}
                        >
                          <AlertTriangle
                            className={
                              inc.prioridad === "crítica"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }
                            size={20}
                          />
                          <div className="flex-1">
                            <p className={`${textPrimary} font-medium text-sm`}>
                              {inc.producto}
                            </p>
                            <p className={`${textSecondary} text-xs`}>
                              {inc.fecha}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${getPrioridadColor(inc.prioridad)}`}
                          >
                            {inc.prioridad}
                          </span>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Productos por Categoría */}
            <div
              className={`${cardClasses} ${isLoadingProducts ? "" : "animate-fade-in"}`}
            >
              <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>
                Productos por Categoría
              </h3>
              <div className="space-y-3">
                {isLoadingProducts ? (
                  <>
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={`loading-category-${i}`}>
                        <div className="flex justify-between text-sm mb-1">
                          <div className={`h-4 ${skeletonClass} rounded w-24`}></div>
                          <div className={`h-4 ${skeletonClass} rounded w-8`}></div>
                        </div>
                        <div className={`w-full ${progressTrack} rounded-full h-2`}>
                          <div className={`${skeletonClass} h-2 rounded-full w-1/2`}></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {categoriaStats.length === 0 ? (
                      <p className={`${textSecondary} text-center py-8`}>
                        No hay productos disponibles
                      </p>
                    ) : (
                      categoriaStats.map((cat) => (
                        <div key={cat.nombre}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={textPrimary}>{cat.nombre}</span>
                            <span className={`${textPrimary} font-semibold`}>
                              {cat.cantidad}
                            </span>
                          </div>
                          <div className={`w-full ${progressTrack} rounded-full h-2`}>
                            <div
                              className={`${progressFill} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${cat.porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
