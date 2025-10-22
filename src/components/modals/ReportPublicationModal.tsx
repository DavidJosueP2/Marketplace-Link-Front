import { useState } from "react";
import Modal from "@/components/marketplace/common/Modal";
import incidenceService from "@/services/incidence.service";
import { ApiError } from "@/services/api";
import { toast } from "sonner";

interface ReportPublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicationId: number;
  onReported?: () => void;
  theme?: "light" | "dark";
}

const reasons = [
  { value: "Spam o publicidad", label: "Spam o publicidad" },
  { value: "Contenido inapropiado", label: "Contenido inapropiado" },
  { value: "Estafa o fraude", label: "Estafa o fraude" },
  { value: "OTHER", label: "Otro" },
];

const ReportPublicationModal = ({
  isOpen,
  onClose,
  publicationId,
  onReported,
  theme = "light",
}: ReportPublicationModalProps) => {
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!reason) return "Debe seleccionar un motivo";
    if (reason === "OTHER" && customReason.trim().length < 3)
      return "Debe especificar un motivo personalizado (mínimo 3 caracteres)";
    if (comment && comment.length > 255)
      return "El comentario debe tener como máximo 255 caracteres";
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      const response = await incidenceService.reportByUser({
        publicationId,
        reason: reason === "OTHER" ? customReason.trim() : reason,
        comment,
      });

      if (response.publication_status === "UNDER_REVIEW") {
        toast.info(
          "Tu reporte fue enviado. La publicación está ahora bajo revisión por el equipo de moderación.",
        );
        onReported?.();
      } else {
        toast.success(response.message || "Reporte enviado correctamente");
      }

      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        const payload = err.payload;
        if (payload.type === "validation" && payload.data?.errors) {
          const validationMessages = Object.values(payload.data.errors)
            .map((msg) => {
              const clean = String(msg).trim();
              return clean.endsWith(".") ? clean.slice(0, -1) : clean;
            })
            .join(". ");
          setError(validationMessages + ".");
          return;
        }

        const message =
          payload?.message ||
          payload?.data?.detail ||
          "No se pudo reclamar la incidencia.";

        setError(message || "Error enviando el reporte");
      } else {
        setError("Error desconocido al enviar el reporte");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const body = (
    <div className="space-y-6">
      {/* Descripción superior */}
      <div className="text-center">
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Selecciona el motivo del reporte y añade un comentario opcional.
        </p>
      </div>

      {/* Motivo */}
      <div className="space-y-2">
        <label
          htmlFor="report-reason"
          className={`block text-sm font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Motivo del reporte
        </label>

        {reason === "OTHER" ? (
          <input
            type="text"
            id="custom-reason"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Escribe el motivo..."
            className={`w-full rounded-lg border px-3 py-2 text-sm transition-all
            ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-[#FF9900]"
                : "bg-white border-gray-300 text-gray-900 focus:ring-[#FF9900]"
            } focus:ring-2 focus:outline-none`}
          />
        ) : (
          <select
            id="report-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm transition-all
            ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-[#FF9900]"
                : "bg-white border-gray-300 text-gray-900 focus:ring-[#FF9900]"
            } focus:ring-2 focus:outline-none`}
          >
            <option value="">Seleccionar motivo</option>
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        )}

        {reason === "OTHER" && (
          <button
            type="button"
            onClick={() => {
              setReason("");
              setCustomReason("");
            }}
            className={`text-xs mt-1 cursor-pointer transition-all px-2 py-[2px] rounded-md
    ${
      theme === "dark"
        ? "text-white hover:text-gray-200 shadow-[0_1px_4px_rgba(255,255,255,0.1)] hover:shadow-[0_2px_6px_rgba(255,255,255,0.15)]"
        : "text-[#FF9900] hover:text-[#e68900] shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:shadow-[0_2px_5px_rgba(0,0,0,0.18)]"
    }`}
          >
            ← Volver a la lista de motivos
          </button>
        )}
      </div>

      {/* Comentario */}
      <div className="space-y-2">
        <label
          htmlFor="report-comment"
          className={`block text-sm font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Comentario
        </label>
        <textarea
          id="report-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Describe brevemente por qué reportas esta publicación..."
          className={`w-full rounded-lg border px-3 py-2 text-sm transition-all
          ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-[#FF9900]"
              : "bg-white border-gray-300 text-gray-900 focus:ring-[#FF9900]"
          } focus:ring-2 focus:outline-none`}
        />
        <div
          className={`text-xs flex justify-end ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {comment.length}/255
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className={`text-sm px-3 py-2 rounded-lg border ${
            theme === "dark"
              ? "text-red-100 bg-[#3F1E1E] border border-[#5C1F1F]"
              : "text-red-700 bg-red-100 border border-red-300"
          }`}
        >
          {error}
        </div>
      )}
    </div>
  );
  const footer = (
    <>
      <button
        onClick={onClose}
        disabled={submitting}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          theme === "dark"
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Cancelar
      </button>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-[#FF9900] hover:bg-[#FFB84D] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Enviando...
          </div>
        ) : (
          "Enviar reporte"
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reportar publicación"
      footer={footer}
      size="md"
      showCloseButton={true}
      closeOnBackdrop={true}
      theme={theme}
    >
      <div className="px-3 py-3">{body}</div>
    </Modal>
  );
};

export default ReportPublicationModal;
