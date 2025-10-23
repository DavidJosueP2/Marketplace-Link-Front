import { appealService } from "@/services/appeal.service";
import { X, Loader2, CheckCircle, XCircle, Scale } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AppealDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appealId: string;
  onDecided: () => void;
  theme?: "light" | "dark";
}

/**
 * Modal para que el moderador decida sobre una apelación (Aceptar o Rechazar).
 */
export default function AppealDecisionModal({
  isOpen,
  onClose,
  appealId,
  onDecided,
  theme = "light",
}: AppealDecisionModalProps) {
  const [decision, setDecision] = useState<"ACCEPTED" | "REJECTED" | null>(
    null,
  );
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!decision) {
      toast.error("Debes seleccionar una decisión antes de continuar.");
      return;
    }

    try {
      setLoading(true);
      await appealService.makeDecision({
        appeal_id: Number(appealId),
        final_decision: decision,
      });
      toast.success(
        decision === "ACCEPTED"
          ? "Apelación aceptada correctamente"
          : "Apelación rechazada correctamente",
      );
      onDecided();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Ocurrió un error al procesar la decisión.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Decidir apelación</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Selecciona la decisión final sobre esta apelación:
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDecision("ACCEPTED")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  decision === "ACCEPTED"
                    ? "border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200"
                    : "border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Aceptar apelación
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setDecision("REJECTED")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  decision === "REJECTED"
                    ? "border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200"
                    : "border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                }`}
              >
                <XCircle className="w-5 h-5" />
                Rechazar apelación
              </button>
            </div>
          </div>

          {/*     <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Explica brevemente las razones de tu decisión, si es necesario."
            />
          </div> */}

          <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!decision || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Scale size={18} />
                  Confirmar decisión
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
