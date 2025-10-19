import { useMemo } from "react";
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Flag,
} from "lucide-react";

const ReportesPage = ({
  reportes = [],
  filtroTipo,
  filtroEstado,
  searchReporte,
  onSearchChange,
  onFiltroTipoChange,
  onFiltroEstadoChange,
  onViewReporte,
  onAprobar,
  onRechazar,
  isLoading = false,
  canModerate = false,
}) => {
  // Filtrar reportes
  const reportesFiltrados = useMemo(() => {
    return reportes.filter((reporte) => {
      const matchTipo = filtroTipo === "todos" || reporte.tipo === filtroTipo;
      const matchEstado =
        filtroEstado === "todos" || reporte.estado === filtroEstado;
      const matchSearch =
        !searchReporte ||
        reporte.reportado.toLowerCase().includes(searchReporte.toLowerCase()) ||
        reporte.razon.toLowerCase().includes(searchReporte.toLowerCase()) ||
        reporte.reportadoPor
          .toLowerCase()
          .includes(searchReporte.toLowerCase());
      return matchTipo && matchEstado && matchSearch;
    });
  }, [reportes, filtroTipo, filtroEstado, searchReporte]);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: reportes.length,
      pendientes: reportes.filter((r) => r.estado === "pendiente").length,
      aprobados: reportes.filter((r) => r.estado === "aprobado").length,
      rechazados: reportes.filter((r) => r.estado === "rechazado").length,
    };
  }, [reportes]);

  const getTipoBadge = (tipo) => {
    const colors = {
      producto: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      usuario:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      vendedor:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return colors[tipo] || colors.producto;
  };

  const getEstadoBadge = (estado) => {
    const colors = {
      pendiente:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      aprobado:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rechazado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[estado] || colors.pendiente;
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "producto":
        return "📦";
      case "usuario":
        return "👤";
      case "vendedor":
        return "🏪";
      default:
        return "📋";
    }
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
          <Flag className="w-8 h-8 text-red-500" />
          Gestión de Reportes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra los reportes de productos y usuarios
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
            Aprobados
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.aprobados}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Rechazados
          </div>
          <div className="text-2xl font-bold text-red-600">
            {stats.rechazados}
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
                placeholder="Reportado, razón, usuario..."
                value={searchReporte}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Filtro Tipo */}
          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => onFiltroTipoChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="todos">Todos los tipos</option>
              <option value="producto">Productos</option>
              <option value="usuario">Usuarios</option>
              <option value="vendedor">Vendedores</option>
            </select>
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
              <option value="aprobado">Aprobados</option>
              <option value="rechazado">Rechazados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reportado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Razón
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
              {reportesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchReporte ||
                      filtroTipo !== "todos" ||
                      filtroEstado !== "todos"
                        ? "No se encontraron reportes con los filtros aplicados"
                        : "No hay reportes registrados"}
                    </p>
                  </td>
                </tr>
              ) : (
                reportesFiltrados.map((reporte) => (
                  <tr
                    key={reporte.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      #{reporte.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoBadge(reporte.tipo)}`}
                      >
                        <span>{getTipoIcon(reporte.tipo)}</span>
                        {reporte.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {reporte.reportado}
                    </td>
                    <td
                      className="px-6 py-4 text-sm max-w-xs truncate"
                      title={reporte.razon}
                    >
                      {reporte.razon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(reporte.estado)}`}
                      >
                        {reporte.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {reporte.reportadoPor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reporte.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewReporte(reporte)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canModerate && reporte.estado === "pendiente" && (
                          <>
                            <button
                              onClick={() => onAprobar(reporte)}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRechazar(reporte)}
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
        {reportesFiltrados.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {reportesFiltrados.length} de {reportes.length} reportes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesPage;
