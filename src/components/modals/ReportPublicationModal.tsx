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
  { value: "Otro", label: "Otro" },
];

const ReportPublicationModal = ({
  isOpen,
  onClose,
  publicationId,
  onReported,
  theme = "light",
}: ReportPublicationModalProps) => {
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>(""); // motivo personalizado si elige “Otro”
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
          {
            description: "Te notificaremos si se toma una decisión sobre ella.",
          },
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
        if (payload.type === "forbidden" && payload.data?.blocked_until) {
          const until = formatBackendDate(payload.data.blocked_until);
          const message =
            payload.data?.detail ||
            payload.message ||
            "Has sido bloqueado temporalmente.";
          setError(`${message} No podrás volver a reportarla hasta ${until}.`);
          return;
        }

        setError(payload.message || "Error enviando el reporte");
      } else {
        setError("Error desconocido al enviar el reporte");
      }
    } finally {
      setSubmitting(false);
    }
  };

  function formatBackendDate(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("es-EC", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  }

  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";

  const body = (
    <div className="space-y-6">
      {/* Descripción superior */}
      <div className="text-center">
        <p className={`${textSecondary} text-sm`}>
          Selecciona el motivo del reporte y añade un comentario opcional.
        </p>
      </div>

      {/* Motivo */}
      <div className="space-y-2">
        <label
          htmlFor="report-reason"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
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
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#FF9900] focus:outline-none transition-all"
          />
        ) : (
          <select
            id="report-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#FF9900] focus:outline-none transition-all"
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
            className="text-xs text-[#FF9900] hover:underline mt-1 cursor-pointer"
          >
            ← Volver a la lista de motivos
          </button>
        )}
      </div>

      {/* Comentario */}
      <div className="space-y-2">
        <label
          htmlFor="report-comment"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
        >
          Comentario (opcional)
        </label>
        <textarea
          id="report-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Describe brevemente por qué reportas esta publicación..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#FF9900] focus:outline-none transition-all"
        />
        <div className="text-xs text-gray-500 flex justify-end">
          {comment.length}/255
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-3 py-2 rounded-lg">
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
      icon={<></>}
    >
      <div className="px-6 py-2">{body}</div>
    </Modal>
  );
};

export default ReportPublicationModal;
