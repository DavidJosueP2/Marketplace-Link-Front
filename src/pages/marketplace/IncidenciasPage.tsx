import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  AlertCircle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCardWithShadowClasses,
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getBorderClasses,
  getSkeletonClasses,
  getInputClasses,
} from "@/lib/themeHelpers";

const IncidenciasPage = () => {
  // Obtener datos del layout mediante useOutletContext
  const {
    incidencias = [],
    filtroEstadoIncidencia: filtroEstado,
    setFiltroEstadoIncidencia: onFiltroEstadoChange,
    filtroPrioridadIncidencia: filtroPrioridad,
    setFiltroPrioridadIncidencia: onFiltroPrioridadChange,
    searchIncidencia,
    setSearchIncidencia: onSearchChange,
    getPrioridadColor,
    isLoadingIncidencias: isLoading = false,
    mockUser,
    theme = "light",
  } = useOutletContext<{
    incidencias: any[];
    filtroEstadoIncidencia: string;
    setFiltroEstadoIncidencia: (estado: string) => void;
    filtroPrioridadIncidencia: string;
    setFiltroPrioridadIncidencia: (prioridad: string) => void;
    searchIncidencia: string;
    setSearchIncidencia: (search: string) => void;
    getPrioridadColor: (prioridad: string) => string;
    isLoadingIncidencias: boolean;
    mockUser: any;
    theme: "light" | "dark";
  }>();

  const canModerate =
    mockUser?.role === "MODERADOR" || mockUser?.role === "ADMINISTRADOR";

  const onViewIncidencia = (incidencia: any) => {
    toast.info(`Ver incidencia #${incidencia.id}`);
  };

  const onAprobar = (incidencia: any) => {
    toast.success(`Incidencia #${incidencia.id} aprobada`);
  };

  const onRechazar = (incidencia: any) => {
    toast.error(`Incidencia #${incidencia.id} rechazada`);
  };
  
  // Obtener clases del tema
  const cardClasses = getCardWithShadowClasses(theme);
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const borderClass = getBorderClasses(theme);
  const skeletonClass = getSkeletonClasses(theme);
  const inputClass = getInputClasses(theme);

  // Filtrar incidencias
  const incidenciasFiltradas = useMemo(() => {
    return incidencias.filter((inc: any) => {
      const matchEstado =
        filtroEstado === "todos" || inc.estado === filtroEstado;
      const matchPrioridad =
        filtroPrioridad === "todas" || inc.prioridad === filtroPrioridad;
      const matchSearch =
        !searchIncidencia ||
        inc.producto.toLowerCase().includes(searchIncidencia.toLowerCase()) ||
        inc.descripcion
          .toLowerCase()
          .includes(searchIncidencia.toLowerCase()) ||
        inc.reportadoPor.toLowerCase().includes(searchIncidencia.toLowerCase());
      return matchEstado && matchPrioridad && matchSearch;
    });
  }, [incidencias, filtroEstado, filtroPrioridad, searchIncidencia]);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: incidencias.length,
      pendientes: incidencias.filter((i: any) => i.estado === "pendiente").length,
      resueltas: incidencias.filter((i: any) => i.estado === "resuelta").length,
      rechazadas: incidencias.filter((i: any) => i.estado === "rechazada").length,
    };
  }, [incidencias]);

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "resuelta":
        return <CheckCircle className="w-4 h-4" />;
      case "rechazada":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      resuelta:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rechazada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[estado] || colors.pendiente;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className={`${cardClasses} animate-pulse`}>
          <div className={`h-8 ${skeletonClass} rounded w-1/3 mb-4`}></div>
          <div className={`h-4 ${skeletonClass} rounded w-2/3`}></div>
        </div>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={`skeleton-incidencia-${i}`}
            className={`${cardClasses} animate-pulse`}
          >
            <div className={`h-4 ${skeletonClass} rounded w-3/4 mb-2`}></div>
            <div className={`h-4 ${skeletonClass} rounded w-1/2`}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cardClasses}>
        <h1 className={`${textPrimary} text-3xl font-bold mb-2 flex items-center gap-2`}>
          <AlertCircle className="w-8 h-8 text-orange-500" />
          Gestión de Incidencias
        </h1>
        <p className={textSecondary}>
          Administra las incidencias reportadas por los usuarios
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={cardClasses}>
          <div className={`text-sm ${textSecondary}`}>Total</div>
          <div className={`${textPrimary} text-2xl font-bold`}>{stats.total}</div>
        </div>
        <div className={cardClasses}>
          <div className={`text-sm ${textSecondary}`}>
            Pendientes
          </div>
          <div className={`${textPrimary} text-2xl font-bold text-yellow-600`}>
            {stats.pendientes}
          </div>
        </div>
        <div className={cardClasses}>
          <div className={`text-sm ${textSecondary}`}>
            Resueltas
          </div>
          <div className={`${textPrimary} text-2xl font-bold text-green-600`}>
            {stats.resueltas}
          </div>
        </div>
        <div className={cardClasses}>
          <div className={`text-sm ${textSecondary}`}>
            Rechazadas
          </div>
          <div className={`${textPrimary} text-2xl font-bold text-red-600`}>
            {stats.rechazadas}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={cardClasses}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className={`${textPrimary} text-lg font-semibold`}>Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label htmlFor="search-incidencia" className={`block text-sm font-medium mb-2 ${textPrimary}`}>Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="search-incidencia"
                type="text"
                placeholder="Producto, descripción, usuario..."
                value={searchIncidencia}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 ${inputClass}`}
              />
            </div>
          </div>

          {/* Filtro Estado */}
          <div>
            <label htmlFor="filtro-estado" className={`block text-sm font-medium mb-2 ${textPrimary}`}>Estado</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(e) => onFiltroEstadoChange(e.target.value)}
              className={inputClass}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="resuelta">Resueltas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>

          {/* Filtro Prioridad */}
          <div>
            <label htmlFor="filtro-prioridad" className={`block text-sm font-medium mb-2 ${textPrimary}`}>Prioridad</label>
            <select
              id="filtro-prioridad"
              value={filtroPrioridad}
              onChange={(e) => onFiltroPrioridadChange(e.target.value)}
              className={inputClass}
            >
              <option value="todas">Todas las prioridades</option>
              <option value="crítica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Incidencias */}
      <div className={`${cardClasses} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reportado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderClass}`}>
              {incidenciasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className={textSecondary}>
                      No se encontraron incidencias
                    </p>
                  </td>
                </tr>
              ) : (
                incidenciasFiltradas.map((incidencia: any) => (
                  <tr
                    key={incidencia.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      #{incidencia.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {incidencia.producto}
                    </td>
                    <td
                      className="px-6 py-4 text-sm max-w-xs truncate"
                      title={incidencia.descripcion}
                    >
                      {incidencia.descripcion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadColor(incidencia.prioridad)}`}
                      >
                        {incidencia.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(incidencia.estado)}`}
                      >
                        {getEstadoIcon(incidencia.estado)}
                        {incidencia.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {incidencia.reportadoPor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {incidencia.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewIncidencia(incidencia)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canModerate && incidencia.estado === "pendiente" && (
                          <>
                            <button
                              onClick={() => onAprobar(incidencia)}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRechazar(incidencia)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Rechazar"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con info */}
        {incidenciasFiltradas.length > 0 && (
          <div className={`px-6 py-4 border-t ${borderClass} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
            <p className={`text-sm ${textSecondary}`}>
              Mostrando {incidenciasFiltradas.length} de {incidencias.length}
              incidencias
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidenciasPage;
