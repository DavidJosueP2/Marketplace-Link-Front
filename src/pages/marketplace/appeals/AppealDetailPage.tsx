import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/shadcn/badge";
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

  const { status, final_decision, created_at, seller, incidence } = appeal;

  const date = new Date(created_at);

  const totalPages = Math.ceil(incidence.reports.length / pageSize);
  const paginatedReports = incidence.reports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const canMakeAppeal =
    status === "ASSIGNED" && incidence.status === "APPEALED";

  const statusColors = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    ASSIGNED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    FAILED_NO_MOD: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    REVIEWED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const decisionColors = {
    ACCEPTED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    PENDING: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  const statusColor =
    statusColors[status as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  const decisionColor =
    decisionColors[final_decision as keyof typeof decisionColors] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  console.log("apelacion", appeal);

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
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Detalles de la Apelación
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
                  {incidence.publication?.name}
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Apelación creada el {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {incidence.publication?.description && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {incidence.publication.description}
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
                      PENDING: "Pendiente",
                      ASSIGNED: "Asignada",
                      FAILED_NO_MOD: "Sin moderador",
                      REVIEWED: "Revisada",
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
                      ACCEPTED: "Aceptada",
                      REJECTED: "Rechazada",
                      PENDING: "Pendiente",
                    }[final_decision as keyof typeof decisionColors] ||
                      "Desconocido"}
                  </Badge>
                </div>
              </div>

              {canMakeAppeal && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-medium"
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
        </div>

        {/* Información del vendedor */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Información del Vendedor
            </h3>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 font-semibold text-lg">
                  {seller.fullname?.charAt(0) || "?"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">
                  {seller.fullname}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {seller.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Moderador anterior */}
        {incidence.previous_moderator && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Moderador Anterior
              </h3>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                    {incidence.previous_moderator.fullname?.charAt(0) || "?"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {incidence.previous_moderator.fullname}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {incidence.previous_moderator.email}
                  </p>
                </div>
              </div>

              {incidence.moderator_comment && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {incidence.moderator_comment}
                  </p>
                  <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    — Comentario del moderador anterior
                  </div>
                </div>
              )}
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
              Reportes asociados ({incidence.reports.length})
            </h3>
          </div>

          {incidence.reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl w-fit mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No hay reportes registrados para esta apelación.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReports.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-6">
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

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {r.comment || "Sin comentario adicional."}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">ID: #{r.id}</span>
                    <span>
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString() +
                          " " +
                          new Date(r.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Fecha no disponible"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {incidence.reports.length > pageSize && (
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
