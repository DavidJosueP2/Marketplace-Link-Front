import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { UserCard } from "../users";
import { Pagination } from "../common";
import { useUsuarioFilters } from "../../hooks/marketplace";

const ROLE_FILTERS = ["Todos", "Usuario", "Vendedor", "Admin"];

const UsersView = ({
  usuarios = [],
  currentUser = null,
  onEditUser = () => {},
  onDeleteUser = () => {},
  onToggleUserStatus = () => {},
  onCreateUser = () => {},
  onViewUser = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Use custom filter hook
  const filteredUsuarios = useUsuarioFilters(usuarios, {
    rol: selectedRole === "Todos" ? null : selectedRole,
    busqueda: searchQuery,
  });

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsuarios.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Usuarios
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredUsuarios.length} usuarios encontrados
            </p>
          </div>

          {/* Create User Button */}
          {currentUser?.rol === "admin" && (
            <button
              onClick={onCreateUser}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Crear Usuario
            </button>
          )}
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, email, teléfono..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2 flex-wrap">
              {ROLE_FILTERS.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedRole === role
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-600 dark:text-blue-400 font-semibold">
                {usuarios.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-purple-600 dark:text-purple-400 font-semibold">
                {usuarios.filter((u) => u.rol === "Vendedor").length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Vendedores
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-600 dark:text-green-400 font-semibold">
                {usuarios.filter((u) => u.estado === "Activo").length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Activos
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                {usuarios.filter((u) => u.estado === "Inactivo").length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Inactivos
              </p>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {paginatedUsers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedUsers.map((usuario) => (
                <UserCard
                  key={usuario.id}
                  usuario={usuario}
                  onEdit={
                    currentUser?.rol === "admin"
                      ? () => onEditUser(usuario.id)
                      : null
                  }
                  onDelete={
                    currentUser?.rol === "admin"
                      ? () => onDeleteUser(usuario.id)
                      : null
                  }
                  onToggleStatus={
                    currentUser?.rol === "admin"
                      ? () => onToggleUserStatus(usuario.id)
                      : null
                  }
                  onView={() => onViewUser(usuario.id)}
                  canManage={currentUser?.rol === "admin"}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM4 20h5v-2a3 3 0 00-.056-1.487"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay usuarios
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No se encontraron usuarios con los filtros aplicados.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRole("Todos");
                setCurrentPage(1);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersView;
