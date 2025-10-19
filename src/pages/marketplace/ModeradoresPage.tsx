import { useMemo } from "react";
import {
  Shield,
  Search,
  Filter,
  Edit2,
  Trash2,
  Plus,
  UserCheck,
} from "lucide-react";

const ModeradoresPage = ({
  moderadores = [],
  filtroEstado,
  searchModerador,
  onSearchChange,
  onFiltroEstadoChange,
  onOpenCreateModerador,
  onEditModerador,
  onDeleteModerador,
  onToggleModeradorStatus,
  isLoading = false,
}) => {
  // Filtrar moderadores
  const moderadoresFiltrados = useMemo(() => {
    return moderadores.filter((mod) => {
      const matchEstado =
        filtroEstado === "todos" || mod.estado === filtroEstado;
      const matchSearch =
        !searchModerador ||
        mod.nombre.toLowerCase().includes(searchModerador.toLowerCase()) ||
        mod.apellido.toLowerCase().includes(searchModerador.toLowerCase()) ||
        mod.email.toLowerCase().includes(searchModerador.toLowerCase()) ||
        mod.cedula.includes(searchModerador);
      return matchEstado && matchSearch;
    });
  }, [moderadores, filtroEstado, searchModerador]);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: moderadores.length,
      activos: moderadores.filter((m) => m.estado === "activo").length,
      inactivos: moderadores.filter((m) => m.estado === "inactivo").length,
      suspendidos: moderadores.filter((m) => m.estado === "suspendido").length,
    };
  }, [moderadores]);

  const getEstadoBadge = (estado) => {
    const colors = {
      activo:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactivo: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      suspendido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[estado] || colors.inactivo;
  };

  const getInitials = (nombre, apellido) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
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
              <Shield className="w-8 h-8 text-blue-600" />
              Gestión de Moderadores
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administra los moderadores del sistema
            </p>
          </div>
          <button
            onClick={onOpenCreateModerador}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Moderador
          </button>
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
            Activos
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.activos}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Inactivos
          </div>
          <div className="text-2xl font-bold text-gray-600">
            {stats.inactivos}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Suspendidos
          </div>
          <div className="text-2xl font-bold text-red-600">
            {stats.suspendidos}
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
                placeholder="Nombre, email, cédula..."
                value={searchModerador}
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
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="suspendido">Suspendidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Moderadores */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Moderador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cédula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {moderadoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchModerador || filtroEstado !== "todos"
                        ? "No se encontraron moderadores con los filtros aplicados"
                        : "No hay moderadores registrados"}
                    </p>
                  </td>
                </tr>
              ) : (
                moderadoresFiltrados.map((moderador) => (
                  <tr
                    key={moderador.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {getInitials(moderador.nombre, moderador.apellido)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">
                            {moderador.nombre} {moderador.apellido}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Moderador
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {moderador.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {moderador.cedula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {moderador.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleModeradorStatus(moderador)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getEstadoBadge(moderador.estado)}`}
                      >
                        {moderador.estado}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditModerador(moderador)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteModerador(moderador)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con info */}
        {moderadoresFiltrados.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {moderadoresFiltrados.length} de {moderadores.length}{" "}
              moderadores
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeradoresPage;
