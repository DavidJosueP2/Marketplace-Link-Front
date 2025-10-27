import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import incidenceService from "@/services/incidence.service";
import DecisionModal from "@/components/modals/DecisionModal";

import type { IncidenceDetailsResponse } from "./types/d.types";
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
    useState<IncidenceDetailsResponse | null>(null);

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
  const statusColors = {
    OPEN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    PENDING_REVIEW:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    UNDER_REVIEW:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    APPEALED:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    RESOLVED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const decisionColors = {
    PENDING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    APPROVED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const statusColor =
    statusColors[status as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  const decisionColor =
    decisionColors[incidence_decision as keyof typeof decisionColors] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="space-y-10">
        {/* Header */}
        <header className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Detalles de la Incidencia
            </h1>
          </div>
        </header>

        {/* Información general */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Publicación:{" "}
                <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer">
                  {publication?.name}
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Creada el {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {publication?.description && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {publication.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-3 ml-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Estado:
                  </span>
                  <Badge
                    className={`${statusColor} px-3 py-1 text-sm font-medium`}
                  >
                    {{
                      OPEN: "Abierta",
                      PENDING_REVIEW: "Pendiente de revisión",
                      UNDER_REVIEW: "En revisión",
                      APPEALED: "Apelada",
                      RESOLVED: "Resuelta",
                    }[status as keyof typeof statusColors] || "Desconocido"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Decisión:
                  </span>
                  <Badge
                    className={`${decisionColor} px-3 py-1 text-sm font-medium`}
                  >
                    {{
                      PENDING: "Pendiente de decisión",
                      APPROVED: "Aprobada",
                      REJECTED: "Rechazada",
                    }[incidence_decision as keyof typeof decisionColors] ||
                      "Desconocido"}
                  </Badge>
                </div>
              </div>

              {(status === "PENDING_REVIEW" || status === "OPEN") &&
                incidence_decision === "PENDING" && (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium"
                    onClick={handleClaim}
                  >
                    Atender incidencia
                  </Button>
                )}

              {status === "UNDER_REVIEW" &&
                incidence_decision === "PENDING" && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 font-medium"
                      onClick={() => setShowDecisionModal(true)}
                    >
                      Hacer decisión
                    </Button>

                    <DecisionModal
                      isOpen={showDecisionModal}
                      onClose={() => setShowDecisionModal(false)}
                      incidenceId={publicUi!}
                      onDecided={async () => {
                        const updated =
                          await incidenceService.fetchIncidenceById(publicUi!);
                        setIncidenceDetailResponse(updated);
                      }}
                      theme="light"
                    />
                  </>
                )}
            </div>
          </div>
        </div>

        {/* Comentario del moderador */}
        {incidenceDetailResponse.moderator_comment && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Comentario del moderador
              </h3>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-l-4 border-blue-500">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {incidenceDetailResponse.moderator_comment}
              </p>
              <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                — Comentario añadido durante la decisión de la incidencia
              </div>
            </div>
          </div>
        )}

        {/* Reportes asociados */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Reportes asociados ({reports.length})
            </h3>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl w-fit mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No hay reportes registrados para esta incidencia.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReports.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                          {r.reporter?.fullname?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Reportado por:
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {r.reporter?.fullname ?? "Usuario desconocido"}
                        </p>
                      </div>
                    </div>

                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-3 py-1">
                      {r.reason}
                    </Badge>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {r.comment || "Sin comentario adicional."}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">ID: #{r.id}</span>
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
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Siguiente ›
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
