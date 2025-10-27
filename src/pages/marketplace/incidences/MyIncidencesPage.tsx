import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";
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

export default function MyIncidencesPage() {
  const [incidencesData, setIncidencesData] =
    useState<ApiResponseIncidence | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidences(0, 10);
  }, []);

  const loadIncidences = async (page: number, size: number) => {
    try {
      setLoading(true);
      const data = await incidenceService.fetchAllReviewed({ page, size });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        Loading your incidences...
      </div>
    );
  }

  if (!incidencesData || incidencesData.content.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl mb-4">
            <ClipboardCheck className="w-12 h-12 text-green-500 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No tienes incidencias asignadas
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            No se encontraron incidencias asignadas a ti en este momento. Revisa
            las incidencias pendientes para reclamar alguna.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <header className="flex flex-col gap-1 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <ClipboardCheck className="text-green-500" /> Mis Incidencias
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Incidencias que estás revisando actualmente o has reclamado
        </p>
      </header>

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
    </div>
  );
}
