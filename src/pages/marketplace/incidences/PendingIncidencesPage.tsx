import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserX, Filter, X } from "lucide-react";
import incidenceService from "@/services/incidence.service";
import DataTable from "@/components/ui/table/data-table-pb";
import { columns } from "./extras/columns";
import { rowActions } from "./extras/row-actions";
import type { ApiResponseIncidence } from "./types/d.types";
import { ApiError } from "@/services/api";

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export default function PendingIncidencesPage() {
  const [incidencesData, setIncidencesData] =
    useState<ApiResponseIncidence | null>(null);

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    loadIncidences(0, 10);
  }, []);

  const formatDateForApi = (dateValue: string): string | undefined => {
    if (!dateValue) return undefined;
    // El input datetime-local devuelve formato "YYYY-MM-DDTHH:mm"
    // El backend espera ISO_DATE_TIME "YYYY-MM-DDTHH:mm:ss"
    // Agregamos ":00" si no tiene segundos
    return dateValue.includes(":") && dateValue.split(":").length === 2
      ? `${dateValue}:00`
      : dateValue;
  };

  const loadIncidences = async (
    page: number,
    size: number,
    customStartDate?: string | null,
    customEndDate?: string | null,
  ) => {
    try {
      setLoading(true);
      const params: {
        page: number;
        size: number;
        startDate?: string;
        endDate?: string;
      } = { page, size };

      // Usar los valores personalizados si se proporcionan explícitamente, de lo contrario usar el estado
      const dateToFormatStart =
        customStartDate !== undefined ? customStartDate : startDate;
      const dateToFormatEnd =
        customEndDate !== undefined ? customEndDate : endDate;

      const formattedStartDate = formatDateForApi(dateToFormatStart || "");
      const formattedEndDate = formatDateForApi(dateToFormatEnd || "");

      if (formattedStartDate != null) {
        params.startDate = formattedStartDate;
      }
      if (formattedEndDate != null) {
        params.endDate = formattedEndDate;
      }

      console.log(params);
      const data = await incidenceService.fetchAllUnreviewed(params);
      setIncidencesData(data);
    } catch (err) {
      if (err instanceof ApiError) {
        const payload = err.payload;
        const message =
          payload?.message ||
          payload?.data?.detail ||
          "No se pudo reclamar la incidencia.";

        toast.errror(message || "Error loading incidences");
        return;
      }

      toast.error("Error loading incidences");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    if (!startDate || !endDate) {
      toast.error("Debes seleccionar ambas fechas para aplicar el filtro");
      return;
    }

    // Validar que la fecha final sea posterior a la fecha inicial
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      toast.error("La fecha final debe ser posterior a la fecha inicial");
      return;
    }

    loadIncidences(0, incidencesData?.size || 10);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    // Llamar con valores explícitos vacíos para asegurar que no se envíen los filtros
    loadIncidences(0, incidencesData?.size || 10, "", "");
  };

  const hasActiveFilters = startDate || endDate;
  const isValidDateRange = startDate && endDate && new Date(endDate) >= new Date(startDate);
  const canApplyFilters = isValidDateRange;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <header className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <UserX className="text-orange-500" /> Incidencias Pendientes
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Revisa y administra las incidencias sin revisar
          </p>
        </header>

        {/* Filtros de fecha */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Filtrar por fecha
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="ml-auto flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Fecha inicial <span className="text-red-500">*</span>
              </label>
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Fecha final <span className="text-red-500">*</span>
              </label>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleApplyFilters}
              disabled={!canApplyFilters}
              className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                canApplyFilters
                  ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Aplicar filtros
            </button>
            {!canApplyFilters && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {!startDate || !endDate
                  ? "Selecciona ambas fechas para aplicar el filtro"
                  : "La fecha final debe ser posterior a la fecha inicial"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-300">
          Loading pending incidences...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <header className="flex flex-col gap-1 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <UserX className="text-orange-500" /> Incidencias Pendientes
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Revisa y administra las incidencias sin revisar
        </p>
      </header>

      {/* Filtros de fecha */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Filtrar por fecha
          </h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="ml-auto flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Fecha inicial <span className="text-red-500">*</span>
            </label>
            <input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Fecha final <span className="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleApplyFilters}
            disabled={!canApplyFilters}
            className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
              canApplyFilters
                ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            Aplicar filtros
          </button>
            {!canApplyFilters && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {!startDate || !endDate
                  ? "Selecciona ambas fechas para aplicar el filtro"
                  : "La fecha final debe ser posterior a la fecha inicial"}
              </span>
            )}
        </div>
      </div>

      {!incidencesData || incidencesData.content.length === 0 ? (
        <div className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl mb-4">
              <UserX className="w-12 h-12 text-orange-500 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay incidencias pendientes
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              No se encontraron incidencias pendientes de revisión en este
              momento.
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={incidencesData.content}
          manualPagination
          totalRows={incidencesData.totalElements}
          pageCount={incidencesData.totalPages}
          state={{
            pagination: {
              pageIndex: incidencesData.number,
              pageSize: incidencesData.size,
            },
          }}
          onPaginationChange={(newPage: PaginationState) =>
            loadIncidences(newPage.pageIndex, newPage.pageSize)
          }
          rowActions={rowActions}
        />
      )}
    </div>
  );
}
