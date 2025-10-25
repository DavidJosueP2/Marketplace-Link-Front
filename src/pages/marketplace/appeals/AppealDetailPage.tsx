import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/shadcn/badge";
import { Card } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft, Clock, AlertCircle, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/services/api";
import type { AppealDetailsResponse } from "../incidences/types/d.types";
import { appealService } from "@/services/appeal.service";
import AppealDecisionModal from "@/components/modals/AppealDecisionModal";

export default function AppealDetailPage() {
  const navigate = useNavigate();
  const { appealId } = useParams();

  const [appeal, setAppeal] = useState<AppealDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [showAppealModal, setShowAppealModal] = useState(false);
  const handleAppeal = () => setShowAppealModal(true);

  // paginación local
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (!appealId) return;
    const fetchAppeal = async () => {
      try {
        const data = await appealService.fetchById(appealId);
        setAppeal(data);
      } catch (err) {
        if (err instanceof ApiError) {
          const message =
            err.payload?.message || "No se pudo cargar la apelación.";
          toast.error(message);
        } else {
          toast.error("Error inesperado al cargar la apelación.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAppeal();
  }, [appealId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        <Clock className="w-8 h-8 mb-2 animate-spin text-orange-500" />
        <p>Cargando detalles de la apelación...</p>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
        <p>No se encontró la apelación solicitada.</p>
      </div>
    );
  }

  const {
    status,
    final_decision,
    created_at,
    new_moderator,
    seller,
    incidence,
  } = appeal;

  const date = new Date(created_at);

  const totalPages = Math.ceil(incidence.reports.length / pageSize);
  const paginatedReports = incidence.reports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const canMakeAppeal =
    status === "ASSIGNED" && incidence.status === "APPEALED";

  const statusColor =
    {
      PENDING:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      ASSIGNED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      FAILED_NO_MOD:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      REVIEWED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  const decisionColor =
    {
      ACCEPTED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      PENDING: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    }[final_decision] ||
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
            Detalles de la Apelación
          </h1>
        </div>
      </header>

      {/* Información general */}
      {/* Info general */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Publicación:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {incidence.publication?.name}
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

          {/* Botones de estado + acción */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Badge
                className={
                  {
                    PENDING:
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                    ASSIGNED:
                      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                    FAILED_NO_MOD:
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    REVIEWED:
                      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                  }[status] || "bg-gray-100 text-gray-800"
                }
              >
                {status === "ASSIGNED"
                  ? "Asignada"
                  : status === "REVIEWED"
                    ? "Revisada"
                    : "Pendiente"}
              </Badge>

              <Badge
                className={
                  {
                    ACCEPTED:
                      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                    REJECTED:
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    PENDING:
                      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
                  }[final_decision]
                }
              >
                {final_decision === "PENDING"
                  ? "Pendiente"
                  : final_decision === "ACCEPTED"
                    ? "Aceptada"
                    : "Rechazada"}
              </Badge>
            </div>

            {canMakeAppeal && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#FF9900] hover:bg-[#FFB84D] text-white"
                  onClick={handleAppeal}
                >
                  Decidir apelación
                </Button>

                <AppealDecisionModal
                  isOpen={showAppealModal}
                  onClose={() => setShowAppealModal(false)}
                  appealId={appealId!}
                  onDecided={async () => {
                    const updated = await appealService.fetchById(appealId!);
                    setAppeal(updated);
                  }}
                  theme="light"
                />
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Vendedor */}
      <Card className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Vendedor
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {seller.fullname} ({seller.email})
        </p>
      </Card>

      {/* Moderador anterior */}
      {incidence.previous_moderator && (
        <Card className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            Moderador anterior
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {incidence.previous_moderator.fullname} (
            {incidence.previous_moderator.email})
          </p>
          <div className="mt-3 bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
            <p
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
              style={{ wordBreak: "break-word" }}
            >
              {incidence.moderator_comment ||
                "Sin comentario del moderador anterior."}
            </p>
          </div>
        </Card>
      )}

      {/* Reportes asociados */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Reportes asociados ({incidence.reports.length})
        </h3>

        {incidence.reports.length === 0 ? (
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
                    {r.created_at
                      ? new Date(r.created_at).toLocaleString()
                      : "Fecha no disponible"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {incidence.reports.length > pageSize && (
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
