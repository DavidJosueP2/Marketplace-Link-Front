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
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        <Scale className="w-8 h-8 text-blue-500 mb-2" />
        <p>No tienes apelaciones registradas aún.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Scale className="text-blue-500" /> Mis Apelaciones
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Estas son las apelaciones que has enviado o que estás revisando como
          moderador.
        </p>
      </header>

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
  );
}
