import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/shadcn/badge";
import { Card } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import incidenceService from "@/services/incidence.service";
import type {
  IncidenceDetailResponse,
  RequestMakeDecision,
} from "./types/d.types";
import Modal from "@/components/marketplace/common/Modal";

export default function IncidenceDetailPage() {
  const navigate = useNavigate();

  // para la decision (en caso de estar en el estado de en revision y pendiente)
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | "">("");
  const [comment, setComment] = useState("");
  const [loadingDecision, setLoadingDecision] = useState(false);

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
          toast.error("Invalid incidence ID");
          return;
        }

        const data = await incidenceService.fetchIncidenceById(publicUi);
        setIncidenceDetailResponse(data);
      } catch (error) {
        console.error(error);
        toast.error("Error loading incidence details");
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
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message || "No se pudo reclamar la incidencia.";
      toast.error(msg);
    }
  };

  // para hacer la decision
  const handleDecision = async () => {
    if (!publicUi) return;

    if (!decision || comment.trim().length < 10) {
      toast.error(
        "Debes seleccionar una decisión y escribir un comentario (mínimo 10 caracteres).",
      );
      return;
    }

    const payload: RequestMakeDecision = {
      incidence_id: publicUi,
      comment: comment.trim(),
      decision,
    };

    try {
      setLoadingDecision(true);
      const res = await incidenceService.makeDecision(payload);
      toast.success(res.message || "Decisión registrada correctamente");

      // refresca la incidencia para ver el nuevo estado/decisión
      const updatedData = await incidenceService.fetchIncidenceById(publicUi);
      setIncidenceDetailResponse(updatedData);

      // Cierra el modal
      setShowDecisionModal(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error al registrar la decisión.",
      );
    } finally {
      setLoadingDecision(false);
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

  const bodyModalDecision = (
    <div className="space-y-4">
      {/* Selector de decisión */}
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
          Decisión
        </label>
        <select
          className="w-full border rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
          value={decision}
          onChange={(e) =>
            setDecision(e.target.value as "APPROVED" | "REJECTED")
          }
        >
          <option value="">Selecciona una opción</option>
          <option value="APPROVED">Aprobar publicación</option>
          <option value="REJECTED">Rechazar publicación</option>
        </select>
      </div>

      {/* Comentario */}
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
          Comentario
        </label>
        <textarea
          className="w-full border rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Explica brevemente la razón de tu decisión..."
        />
        <p className="text-xs text-gray-400 mt-1">Mínimo 10 caracteres.</p>
      </div>
    </div>
  );

  const footerModalDecision = (
    <>
      <Button variant="outline" onClick={() => setShowDecisionModal(false)}>
        Cancelar
      </Button>
      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={handleDecision}
        disabled={loadingDecision}
      >
        {loadingDecision ? "Guardando..." : "Confirmar decisión"}
      </Button>
    </>
  );

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

            {/* Botones de acción según estado */}
            {status === "PENDING_REVIEW" &&
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
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowDecisionModal(true)}
              >
                Hacer decisión
              </Button>
            )}
          </div>
        </div>
      </Card>

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

      {/* Para el modal de decisiones. SSolo disponible en el estado de UNDER_REVIEW y PENDING
       */}
      <Modal
        isOpen={showDecisionModal}
        onClose={() => setShowDecisionModal(false)}
        title="Registrar decisión"
        size="md"
        theme="light"
        footer={footerModalDecision}
      >
        {bodyModalDecision}
      </Modal>
    </div>
  );
}
