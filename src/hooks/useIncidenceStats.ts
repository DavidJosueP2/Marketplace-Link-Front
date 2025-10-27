import { useState, useEffect } from "react";
import { toast } from "sonner";
import incidenceService from "@/services/incidence.service";
import type { IncidenceStatsResponse } from "@/pages/marketplace/incidences/types/d.types";
import { ApiError } from "@/services/api";

export const useIncidenceStats = () => {
  const [stats, setStats] = useState<IncidenceStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidenceService.fetchStats();
      setStats(data);
    } catch (err) {
      if (err instanceof ApiError) {
        const payload = err.payload;
        const message =
          payload?.message ||
          payload?.data?.detail ||
          "No se pudieron cargar las estadísticas de incidencias.";

        toast.error(message);
        setError(message);
        return;
      }

      const errorMessage = "Error al cargar las estadísticas de incidencias";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
