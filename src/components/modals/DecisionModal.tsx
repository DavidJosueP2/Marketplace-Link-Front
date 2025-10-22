import { useState } from "react";
import Modal from "@/components/marketplace/common/Modal";
import incidenceService from "@/services/incidence.service";
import { ApiError } from "@/services/api";
import { toast } from "sonner";
import type { RequestMakeDecision } from "@/pages/marketplace/incidences/types/d.types";

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidenceId: string;
  onDecided?: () => void;
  theme?: "light" | "dark";
}

const DecisionModal = ({
  isOpen,
  onClose,
  incidenceId,
  onDecided,
  theme = "light",
}: DecisionModalProps) => {
  const [form, setForm] = useState({
    decision: "",
    comment: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!form.decision) return "Debe seleccionar una decisión";
    if (form.comment.trim().length < 10)
      return "El comentario debe tener al menos 10 caracteres.";
    if (form.comment.length > 255)
      return "El comentario no puede exceder los 255 caracteres.";
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    setSubmitting(true);
    try {
      const payload: RequestMakeDecision = {
        incidence_id: incidenceId,
        comment: form.comment.trim(),
        decision: form.decision as "APPROVED" | "REJECTED",
      };

      const response = await incidenceService.makeDecision(payload);
      toast.success(response.message || "Decisión registrada correctamente");

      onDecided?.();
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        const payload = err.payload;
        if (payload.type === "validation" && payload.data?.errors) {
          const messages = Object.values(payload.data.errors)
            .map((m) => String(m).replace(/\.$/, ""))
            .join(". ");
          setError(messages + ".");
          return;
        }

        const message =
          payload?.message ||
          payload?.data?.detail ||
          "No se pudo reclamar la incidencia.";

        setError(message || "Error al registrar la decisión");
      } else {
        setError("Error desconocido al procesar la decisión");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const body = (
    <div className="space-y-6">
      <div className="text-center">
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Selecciona la decisión y añade un comentario breve justificando tu
          elección.
        </p>
      </div>

      {/* Decisión */}
      <div className="space-y-2">
        <label
          htmlFor="decision-select"
          className={`block text-sm font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Decisión
        </label>
        <select
          id="decision-select"
          value={form.decision}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, decision: e.target.value }))
          }
          className={`w-full rounded-lg border px-3 py-2 text-sm transition-all
          ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-[#FF9900]"
              : "bg-white border-gray-300 text-gray-900 focus:ring-[#FF9900]"
          } focus:ring-2 focus:outline-none`}
        >
          <option value="">Selecciona una opción</option>
          <option value="APPROVED">Aprobar publicación</option>
          <option value="REJECTED">Rechazar publicación</option>
        </select>
      </div>

      {/* Comentario */}
      <div className="space-y-2">
        <label
          htmlFor="decision-comment"
          className={`block text-sm font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Comentario
        </label>
        <textarea
          id="decision-comment"
          value={form.comment}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, comment: e.target.value }))
          }
          rows={4}
          placeholder="Explica brevemente la razón de tu decisión..."
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
          {form.comment.length}/255
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
            Guardando...
          </div>
        ) : (
          "Confirmar decisión"
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar decisión"
      footer={footer}
      size="md"
      showCloseButton={true}
      closeOnBackdrop={true}
      theme={theme}
    >
      <div className="px-3 py-2">{body}</div>
    </Modal>
  );
};

export default DecisionModal;
