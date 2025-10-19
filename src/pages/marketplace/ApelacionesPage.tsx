import { useMemo } from "react";
import {
  Scale,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const ApelacionesPage = ({
  apelaciones = [],
  filtroEstado,
  searchApelacion,
  onSearchChange,
  onFiltroEstadoChange,
  onViewApelacion,
  onCreateApelacion,
  isLoading = false,
  userRole = "VENDEDOR",
}) => {
  // Filtrar apelaciones
  const apelacionesFiltradas = useMemo(() => {
    return apelaciones.filter((apelacion) => {
      const matchEstado =
        filtroEstado === "todos" || apelacion.estado === filtroEstado;
      const matchSearch =
        !searchApelacion ||
        apelacion.incidencia
          .toLowerCase()
          .includes(searchApelacion.toLowerCase()) ||
        apelacion.motivo.toLowerCase().includes(searchApelacion.toLowerCase());
      return matchEstado && matchSearch;
    });
  }, [apelaciones, filtroEstado, searchApelacion]);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: apelaciones.length,
      pendientes: apelaciones.filter((a) => a.estado === "pendiente").length,
      aprobadas: apelaciones.filter((a) => a.estado === "aprobada").length,
      rechazadas: apelaciones.filter((a) => a.estado === "rechazada").length,
    };
  }, [apelaciones]);

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "aprobada":
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
      aprobada:
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Scale className="w-8 h-8 text-purple-500" />
              {userRole === "VENDEDOR"
                ? "Mis Apelaciones"
                : "Gestión de Apelaciones"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {userRole === "VENDEDOR"
                ? "Revisa el estado de tus apelaciones enviadas"
                : "Administra las apelaciones de los vendedores"}
            </p>
          </div>
          {userRole === "VENDEDOR" && (
            <button
              onClick={onCreateApelacion}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              Nueva Apelación
            </button>
          )}
        </div>
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
            Aprobadas
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.aprobadas}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Incidencia, motivo..."
                value={searchApelacion}
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
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Apelaciones */}
      <div className="space-y-4">
        {apelacionesFiltradas.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchApelacion || filtroEstado !== "todos"
                ? "No se encontraron apelaciones con los filtros aplicados"
                : "No tienes apelaciones registradas"}
            </p>
            {userRole === "VENDEDOR" && (
              <button
                onClick={onCreateApelacion}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
              >
                <Scale className="w-4 h-4" />
                Crear Primera Apelación
              </button>
            )}
          </div>
        ) : (
          apelacionesFiltradas.map((apelacion) => (
            <div
              key={apelacion.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">
                      Apelación #{apelacion.id}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(apelacion.estado)}`}
                    >
                      {getEstadoIcon(apelacion.estado)}
                      {apelacion.estado}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[100px]">
                        Incidencia:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {apelacion.incidencia}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[100px]">
                        Motivo:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {apelacion.motivo}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[100px]">
                        Fecha:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {apelacion.fecha}
                      </span>
                    </div>
                    {apelacion.resolucion && (
                      <div className="flex items-start gap-2 mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[100px]">
                          Resolución:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {apelacion.resolucion}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onViewApelacion(apelacion)}
                  className="ml-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                  title="Ver detalles"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con info */}
      {apelacionesFiltradas.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Mostrando {apelacionesFiltradas.length} de {apelaciones.length}{" "}
            apelaciones
          </p>
        </div>
      )}
    </div>
  );
};

export default ApelacionesPage;
