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
  } = useOutletContext();

  const canModerate =
    mockUser?.role === "MODERADOR" || mockUser?.role === "ADMINISTRADOR";

  const onViewIncidencia = (incidencia) => {
    toast.info(`Ver incidencia #${incidencia.id}`);
  };

  const onAprobar = (incidencia) => {
    toast.success(`Incidencia #${incidencia.id} aprobada`);
  };

  const onRechazar = (incidencia) => {
    toast.error(`Incidencia #${incidencia.id} rechazada`);
  };
  // Filtrar incidencias
  const incidenciasFiltradas = useMemo(() => {
    return incidencias.filter((inc) => {
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
      pendientes: incidencias.filter((i) => i.estado === "pendiente").length,
      resueltas: incidencias.filter((i) => i.estado === "resuelta").length,
      rechazadas: incidencias.filter((i) => i.estado === "rechazada").length,
    };
  }, [incidencias]);

  const getEstadoIcon = (estado) => {
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

  const getEstadoBadge = (estado) => {
    const colors = {
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <AlertCircle className="w-8 h-8 text-orange-500" />
          Gestión de Incidencias
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra las incidencias reportadas por los usuarios
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Pendientes
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pendientes}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Resueltas
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.resueltas}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Rechazadas
          </div>
          <div className="text-2xl font-bold text-red-600">
            {stats.rechazadas}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Producto, descripción, usuario..."
                value={searchIncidencia}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Filtro Estado */}
          <div>
            <label className="block text-sm font-medium mb-2">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => onFiltroEstadoChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="resuelta">Resueltas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>

          {/* Filtro Prioridad */}
          <div>
            <label className="block text-sm font-medium mb-2">Prioridad</label>
            <select
              value={filtroPrioridad}
              onChange={(e) => onFiltroPrioridadChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
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
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {incidenciasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchIncidencia ||
                      filtroEstado !== "todos" ||
                      filtroPrioridad !== "todas"
                        ? "No se encontraron incidencias con los filtros aplicados"
                        : "No hay incidencias registradas"}
                    </p>
                  </td>
                </tr>
              ) : (
                incidenciasFiltradas.map((incidencia) => (
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
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {incidenciasFiltradas.length} de {incidencias.length}{" "}
              incidencias
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidenciasPage;
