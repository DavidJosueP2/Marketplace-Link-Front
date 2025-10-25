import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserX } from "lucide-react";
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

  useEffect(() => {
    loadIncidences(0, 10);
  }, []);

  const loadIncidences = async (page: number, size: number) => {
    try {
      setLoading(true);
      const data = await incidenceService.fetchAllUnreviewed({ page, size });
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
        Loading pending incidences...
      </div>
    );
  }

  if (!incidencesData || incidencesData.content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        <UserX className="w-8 h-8 text-orange-500 mb-2" />
        <p>No pending incidences found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <UserX className="text-orange-500" /> Pending Incidences
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Review and manage unreviewed incidences
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
