import { useState } from "react";
import { Menu, Filter } from "lucide-react";
import { IncidenciaCard } from "../common";
import { Pagination } from "../common";
import { useIncidenciaFilters } from "../../hooks/marketplace";

const ESTADO_FILTERS = ["Pendiente", "Aprobado", "Rechazado"];

const IncidenciasView = ({
  incidencias = [],
  currentUser = null,
  onApproveIncidencia = () => {},
  onRejectIncidencia = () => {},
  onDeleteIncidencia = () => {},
  onViewIncidencia = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEstado, setSelectedEstado] = useState("Pendiente");
  const [searchQuery, setSearchQuery] = useState("");

  // Use custom filter hook
  const filteredIncidencias = useIncidenciaFilters(incidencias, {
    estado: selectedEstado,
    busqueda: searchQuery,
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredIncidencias.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedIncidencias = filteredIncidencias.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  const handleEstadoChange = (estado) => {
    setSelectedEstado(estado);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Incidencias
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredIncidencias.length} incidencias encontradas
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por producto, usuario, tipo..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Estado Filter */}
            <div className="flex gap-2 flex-wrap">
              {ESTADO_FILTERS.map((estado) => (
                <button
                  key={estado}
                  onClick={() => handleEstadoChange(estado)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedEstado === estado
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                {incidencias.filter((i) => i.estado === "Pendiente").length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Pendientes
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-600 dark:text-green-400 font-semibold">
                {incidencias.filter((i) => i.estado === "Aprobado").length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Aprobados
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                {incidencias.filter((i) => i.estado === "Rechazado").length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Rechazados
              </p>
            </div>
          </div>
        </div>

        {/* Incidencias List */}
        {paginatedIncidencias.length > 0 ? (
          <>
            <div className="space-y-4 mb-8">
              {paginatedIncidencias.map((incidencia) => (
                <IncidenciaCard
                  key={incidencia.id}
                  incidencia={incidencia}
                  onApprove={
                    currentUser?.rol === "admin" &&
                    incidencia.estado === "Pendiente"
                      ? () => onApproveIncidencia(incidencia.id)
                      : null
                  }
                  onReject={
                    currentUser?.rol === "admin" &&
                    incidencia.estado === "Pendiente"
                      ? () => onRejectIncidencia(incidencia.id)
                      : null
                  }
                  onDelete={
                    currentUser?.rol === "admin"
                      ? () => onDeleteIncidencia(incidencia.id)
                      : null
                  }
                  onView={() => onViewIncidencia(incidencia.id)}
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
              <Filter className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay incidencias
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No se encontraron incidencias con los filtros aplicados.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedEstado("Pendiente");
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

export default IncidenciasView;
