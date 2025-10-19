import { Package, ShoppingBag, AlertTriangle, Shield } from "lucide-react";
import { useOutletContext } from "react-router-dom";

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
  } = useOutletContext();

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

  return (
    <div>
      {isLoadingProducts ? (
        <>
          {/* Skeletons para tarjetas estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeletons para secciones de contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 pb-3 border-b dark:border-gray-700 last:border-0 animate-pulse"
                  >
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex justify-between text-sm mb-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"></div>
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Total Productos
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {stats.totalProductos}
                  </p>
                </div>
                <Package className="text-brand" size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Activos
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {stats.productosActivos}
                  </p>
                </div>
                <ShoppingBag className="text-green-600" size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Incidencias
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {stats.incidenciasPendientes}
                  </p>
                </div>
                <AlertTriangle className="text-yellow-600" size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Críticas
                  </p>
                  <p className="text-2xl font-bold mt-2">
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
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow ${!isLoadingIncidencias ? "animate-fade-in" : ""}`}
            >
              <h3 className="text-lg font-semibold mb-4">
                Incidencias Recientes
              </h3>
              <div className="space-y-3">
                {isLoadingIncidencias ? (
                  <>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 pb-3 border-b dark:border-gray-700 last:border-0 animate-pulse"
                      >
                        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {incidencias.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No hay incidencias recientes
                      </p>
                    ) : (
                      incidencias.slice(0, 4).map((inc) => (
                        <div
                          key={inc.id}
                          className="flex items-start gap-3 pb-3 border-b dark:border-gray-700 last:border-0"
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
                            <p className="font-medium text-sm">
                              {inc.producto}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
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
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow ${!isLoadingProducts ? "animate-fade-in" : ""}`}
            >
              <h3 className="text-lg font-semibold mb-4">
                Productos por Categoría
              </h3>
              <div className="space-y-3">
                {isLoadingProducts ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex justify-between text-sm mb-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {categoriaStats.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No hay productos disponibles
                      </p>
                    ) : (
                      categoriaStats.map((cat) => (
                        <div key={cat.nombre}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{cat.nombre}</span>
                            <span className="font-semibold">
                              {cat.cantidad}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-[hsl(var(--primary))] h-2 rounded-full transition-all duration-300"
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
