import {
  UserPlus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";

/**
 * UsuariosPage - Página de gestión de usuarios (Moderador/Administrador)
 */
const UsuariosPage = () => {
  // Obtener datos del layout mediante useOutletContext
  const {
    usuarios = [],
    filtroRolUsuario = "todos",
    setFiltroRolUsuario: onFiltroRolChange,
    filtroEstadoUsuario = "todos",
    setFiltroEstadoUsuario: onFiltroEstadoChange,
    searchUsuario = "",
    setSearchUsuario: onSearchChange,
  } = useOutletContext();

  const isLoading = false;

  // Handlers
  const onOpenCreateUser = () => {
    toast.info("Crear nuevo usuario");
  };

  const onEditUser = (usuario) => {
    toast.info(`Editar usuario: ${usuario.nombre} ${usuario.apellido}`);
  };

  const onDeleteUser = (usuario) => {
    toast.error(`Eliminar usuario: ${usuario.nombre} ${usuario.apellido}`);
  };

  const onToggleUserStatus = (usuario) => {
    const newStatus = usuario.estado === "activo" ? "inactivo" : "activo";
    toast.success(
      `Usuario ${usuario.nombre} ${newStatus === "activo" ? "activado" : "desactivado"}`,
    );
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const rolMatch =
      filtroRolUsuario === "todos" || usuario.rol === filtroRolUsuario;
    const estadoMatch =
      filtroEstadoUsuario === "todos" || usuario.estado === filtroEstadoUsuario;
    const searchMatch =
      searchUsuario.trim() === "" ||
      usuario.nombre.toLowerCase().includes(searchUsuario.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchUsuario.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchUsuario.toLowerCase()) ||
      usuario.cedula.includes(searchUsuario);

    return rolMatch && estadoMatch && searchMatch;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los usuarios del marketplace
          </p>
        </div>
        <button
          onClick={onOpenCreateUser}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 hover:scale-105 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buscador */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, email o cédula..."
              value={searchUsuario}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filtro por Rol */}
          <div>
            <select
              value={filtroRolUsuario}
              onChange={(e) => onFiltroRolChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todos">Todos los roles</option>
              <option value="COMPRADOR">Comprador</option>
              <option value="VENDEDOR">Vendedor</option>
              <option value="MODERADOR">Moderador</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <select
              value={filtroEstadoUsuario}
              onChange={(e) => onFiltroEstadoChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cédula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : usuariosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchUsuario ||
                    filtroRolUsuario !== "todos" ||
                    filtroEstadoUsuario !== "todos"
                      ? "No se encontraron usuarios con los filtros aplicados"
                      : "No hay usuarios registrados"}
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium">
                            {usuario.nombre.charAt(0)}
                            {usuario.apellido.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {usuario.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {usuario.cedula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          usuario.rol === "ADMINISTRADOR"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : usuario.rol === "MODERADOR"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : usuario.rol === "VENDEDOR"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleUserStatus(usuario)}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                          usuario.estado === "activo"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                            : usuario.estado === "suspendido"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {usuario.estado === "activo" ? (
                          <CheckCircle size={12} />
                        ) : usuario.estado === "suspendido" ? (
                          <XCircle size={12} />
                        ) : (
                          <AlertCircle size={12} />
                        )}
                        {usuario.estado}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(usuario.fechaRegistro).toLocaleDateString(
                        "es-EC",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditUser(usuario)}
                          className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded"
                          title="Editar usuario"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => onDeleteUser(usuario)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas */}
      {!isLoading && usuariosFiltrados.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
