import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/shadcn/badge";
import { Card } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import incidenceService from "@/services/incidence.service";
import DecisionModal from "@/components/modals/DecisionModal";

import type { IncidenceDetailResponse } from "./types/d.types";
import { ApiError } from "@/services/api";

export default function IncidenceDetailPage() {
  const navigate = useNavigate();

  // para la decision (en caso de estar en el estado de en revision y pendiente)
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  // paginación local
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // para datos de la incidencia
  const [incidenceDetailResponse, setIncidenceDetailResponse] =
    useState<IncidenceDetailResponse | null>(null);

  const { publicUi } = useParams();

  // para traer los datos de la incidencia
  useEffect(() => {
    const fetchIncidence = async () => {
      try {
        if (!publicUi) {
          toast.error("No se ha encontrado el id de la incidencia.");
          return;
        }

        const data = await incidenceService.fetchIncidenceById(publicUi);
        setIncidenceDetailResponse(data);
      } catch (err: any) {
        if (err instanceof ApiError) {
          const payload = err.payload;

          const message =
            payload?.message ||
            payload?.data?.detail ||
            "No se pudo reclamar la incidencia.";

          toast.error(message);
        } else {
          toast.error("Error inesperado al reclamar la incidencia.");
        }
      }
    };

    fetchIncidence();
  }, [publicUi]);

  // funcion para reclamar incidencia.
  const handleClaim = async () => {
    if (!publicUi) return;

    try {
      const res = await incidenceService.claim(publicUi);
      toast.success(
        res.message + " (" + res.moderator_name + ") " ||
          "Incidencia reclamada correctamente",
      );
      navigate("/marketplace-refactored/incidencias");
    } catch (err: any) {
      if (err instanceof ApiError) {
        const payload = err.payload;

        const message =
          payload?.message ||
          payload?.data?.detail ||
          "No se pudo reclamar la incidencia.";

        toast.error(message);
      } else {
        toast.error("Error inesperado al reclamar la incidencia.");
      }
    }
  };

  if (!incidenceDetailResponse) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        <Clock className="w-8 h-8 mb-2 animate-spin text-orange-500" />
        <p>Cargando detalles de la incidencia...</p>
      </div>
    );
  }

  const { status, incidence_decision, created_at, publication, reports } =
    incidenceDetailResponse;

  const date = new Date(created_at);
  const totalPages = Math.ceil(reports.length / pageSize);
  const paginatedReports = reports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Colores de estado y decisión de la incidencia
  const statusColor =
    {
      OPEN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      PENDING_REVIEW:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      UNDER_REVIEW:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      APPEALED:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      RESOLVED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  const decisionColor =
    {
      PENDING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      APPROVED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }[incidence_decision] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Detalles de la Incidencia
          </h1>
        </div>
      </header>

      {/* Información general */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Publicación:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {publication?.name}
              </span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Creada el {date.toLocaleDateString()}{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Badge className={statusColor}>
                {{
                  OPEN: "Abierta",
                  PENDING_REVIEW: "Pendiente de revisión",
                  UNDER_REVIEW: "En revisión",
                  APPEALED: "Apelada",
                  RESOLVED: "Resuelta",
                }[status] || "Desconocido"}
              </Badge>

              <Badge className={decisionColor}>
                {{
                  PENDING: "Pendiente de decisión",
                  APPROVED: "Aprobada",
                  REJECTED: "Rechazada",
                }[incidence_decision] || "Desconocido"}
              </Badge>
            </div>

            {(status === "PENDING_REVIEW" || status === "OPEN") &&
              incidence_decision === "PENDING" && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleClaim}
                >
                  Atender incidencia
                </Button>
              )}

            {status === "UNDER_REVIEW" && incidence_decision === "PENDING" && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#FF9900] hover:bg-[#FFB84D] text-white"
                  onClick={() => setShowDecisionModal(true)}
                >
                  Hacer decisión
                </Button>

                <DecisionModal
                  isOpen={showDecisionModal}
                  onClose={() => setShowDecisionModal(false)}
                  incidenceId={publicUi!}
                  onDecided={async () => {
                    const updated = await incidenceService.fetchIncidenceById(
                      publicUi!,
                    );
                    setIncidenceDetailResponse(updated);
                  }}
                  theme="light"
                />
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Aqui poner el comentario del moderador, si es que hizo */}
      {incidenceDetailResponse.moderator_comment && (
        <Card className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            Comentario del moderador
          </h3>

          <div className="bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
            <p
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
              style={{ wordBreak: "break-word" }}
            >
              {incidenceDetailResponse.moderator_comment}
            </p>

            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-end italic">
              — Comentario añadido durante la decisión de la incidencia
            </div>
          </div>
        </Card>
      )}

      {/* Reportes en formato cards */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Reportes asociados ({reports.length})
        </h3>

        {reports.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No hay reportes registrados.
          </p>
        ) : (
          <div className="space-y-3">
            {paginatedReports.map((r, i) => (
              <div
                key={i}
                className="p-4 bg-white dark:bg-gray-900/40 rounded-md shadow-sm border-l-4 border-orange-400 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Reportado por:
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {r.reporter?.fullname ?? "Usuario desconocido"}
                    </p>
                  </div>

                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    {r.reason}
                  </Badge>
                </div>

                <p
                  className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed break-words whitespace-pre-line max-w-full overflow-hidden"
                  style={{ wordBreak: "break-word" }}
                >
                  {r.comment || "Sin comentario."}
                </p>

                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>ID: #{r.id}</span>
                  <span>
                    {new Date(r.created_at).toLocaleDateString()}{" "}
                    {new Date(r.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {reports.length > pageSize && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹ Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente ›
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
