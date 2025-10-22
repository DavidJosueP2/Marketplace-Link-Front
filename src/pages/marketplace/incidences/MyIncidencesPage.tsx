import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";
import incidenceService from "@/services/incidence.service";
import DataTable from "@/components/ui/table/data-table-pb";
import { columns } from "./extras/columns";
import { rowActions } from "./extras/row-actions";
import type { ApiResponseIncidence } from "./types/d.types";

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
      console.log("Fetched my incidences data:", data);
      setIncidencesData(data);
    } catch (error) {
      console.error(error);
      toast.error("Error loading your incidences");
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
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        <ClipboardCheck className="w-8 h-8 text-green-500 mb-2" />
        <p>No incidences assigned to you yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <ClipboardCheck className="text-green-500" /> My Incidences
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Incidences you are currently reviewing or have claimed.
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
