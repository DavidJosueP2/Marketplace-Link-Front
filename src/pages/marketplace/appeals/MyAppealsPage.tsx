import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Scale } from "lucide-react"; // ícono relacionado a apelaciones
import DataTable from "@/components/ui/table/data-table-pb";
import { columns } from "./extras/columns-appeals";
import { rowActions } from "./extras/row-actions-appeals";
import { ApiError } from "@/services/api";
import type { ApiResponseAppeal } from "../incidences/types/d.types";
import { appealService } from "@/services/appeal.service";

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export default function MyAppealsPage() {
  const [appealsData, setAppealsData] = useState<ApiResponseAppeal | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppeals(0, 10);
  }, []);

  const loadAppeals = async (page: number, size: number) => {
    try {
      setLoading(true);
      const data = await appealService.fetchMyAppeals({ page, size });
      setAppealsData(data);
    } catch (err) {
      if (err instanceof ApiError) {
        const payload = err.payload;
        const message =
          payload?.message ||
          payload?.data?.detail ||
          "No se pudieron cargar las apelaciones.";
        toast.error(message || "Error loading appeals");
        return;
      }

      toast.error("Error loading appeals");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        Cargando tus apelaciones...
      </div>
    );
  }

  if (!appealsData || appealsData.content.length === 0) {
    return (
      <div className="animate-fade-in space-y-8 pb-8">
        {/* Header */}
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
                <Scale className="w-8 h-8 text-blue-600" />
                Mis Apelaciones
              </h1>
              <p className="text-muted-foreground">
                Estas son las apelaciones que estás revisando como moderador.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow border border-border p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-6">
              <Scale className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No tienes apelaciones registradas aún
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              No se encontraron apelaciones registradas en tu cuenta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      {/* Header */}
      <div className="bg-card p-6 rounded-lg shadow border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
              <Scale className="w-8 h-8 text-blue-600" />
              Mis Apelaciones
            </h1>
            <p className="text-muted-foreground">
              Estas son las apelaciones que estás revisando como moderador.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <DataTable
          columns={columns}
          data={appealsData.content}
          manualPagination
          totalRows={appealsData.totalElements}
          pageCount={appealsData.totalPages}
          state={{
            pagination: {
              pageIndex: appealsData.number,
              pageSize: appealsData.size,
            },
          }}
          onPaginationChange={(newPage: PaginationState) =>
            loadAppeals(newPage.pageIndex, newPage.pageSize)
          }
          rowActions={rowActions}
        />
      </div>
    </div>
  );
}
