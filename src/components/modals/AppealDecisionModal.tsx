import { appealService } from "@/services/appeal.service";
import { Loader2, CheckCircle, XCircle, Scale } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/marketplace/common/Modal";

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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

  const body = (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Selecciona la decisión final sobre esta apelación:
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          disabled={loading}
          onClick={() => setDecision("ACCEPTED")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
            decision === "ACCEPTED"
              ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 shadow-lg"
              : "border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600"
          }`}
        >
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">Aceptar apelación</span>
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => setDecision("REJECTED")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
            decision === "REJECTED"
              ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 shadow-lg"
              : "border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600"
          }`}
        >
          <XCircle className="w-6 h-6" />
          <span className="font-semibold">Rechazar apelación</span>
        </button>
      </div>
    </div>
  );

  const footer = (
    <>
      <button
        onClick={onClose}
        disabled={loading}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancelar
      </button>
      <button
        onClick={handleSubmit}
        disabled={!decision || loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <Scale size={16} />
            Confirmar decisión
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Decidir apelación"
      footer={footer}
      size="md"
      showCloseButton={true}
      closeOnBackdrop={true}
      theme={theme}
      icon={<Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
    >
      <div className="px-3 py-2">{body}</div>
    </Modal>
  );
}
