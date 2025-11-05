import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/shadcn/button";
import { FileWarning, Scale } from "lucide-react";
import { toast } from "sonner";
import incidenceService from "@/services/incidence.service";
import { ApiError } from "@/services/api";

export default function AppealPage() {
  const { publicUi } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicationName, setPublicationName] = useState<string>("");

  // Cargar datos básicos de la incidencia
  useEffect(() => {
    const fetchIncidence = async () => {
      try {
        if (!publicUi) return;
        const data =
          await incidenceService.fetchIncidenceByIdForSeller(publicUi);
        setPublicationName(data.publication?.name || "Publicación desconocida");
      } catch {
        toast.error("No se pudieron cargar los datos de la incidencia.");
      }
    };

    fetchIncidence();
  }, [publicUi]);

  const validate = () => {
    if (!reason.trim()) return "Debe escribir el motivo de la apelación.";
    if (reason.trim().length < 100)
      return "El motivo debe tener al menos 100 caracteres.";
    if (reason.trim().length > 500)
      return "El motivo no puede superar los 500 caracteres.";
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const validationMsg = validate();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        incidence_id: publicUi!,
        reason: reason.trim(),
      };
      const res = await incidenceService.appeal(payload);
      toast.success(res.message || "Apelación enviada correctamente.");
      navigate("/marketplace-refactored/");
    } catch (err: any) {
      if (err instanceof ApiError) {
        const payload = err.payload;

        if (payload.type === "validation" && payload.data?.errors) {
          const validationMessages = Object.values(payload.data.errors)
            .map((msg) => String(msg).trim())
            .join(". ");
          setError(validationMessages + ".");
          return;
        }

        let message = "No se pudo enviar la apelación.";
        if (payload?.message) {
          message = payload.message;
        } else if (payload?.data?.detail) {
          message = payload.data.detail;
        }
        setError(message);
      } else {
        setError("Error inesperado al enviar la apelación.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <Scale className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Apelar Decisión de Moderación
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Si consideras que la decisión tomada por los moderadores sobre tu
          publicación fue injusta o incorrecta, puedes presentar una apelación
          detallada para que sea revisada nuevamente
        </p>
      </div>

      {/* Main Content */}
      {/* Publication Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/50 rounded-xl">
            <FileWarning className="text-orange-600 dark:text-orange-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Publicación afectada
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {publicationName ?? "Publicación desconocida..."}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Appeal Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="space-y-6">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Motivo de Apelación
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Describe con detalle los motivos de tu apelación. Tu explicación
              debe ser clara y fundamentada.
            </p>
          </div>

          {/* Textarea */}
          <div className="space-y-3">
            <label
              htmlFor="appeal-reason"
              className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
            >
              Explicación detallada *
            </label>
            <textarea
              id="appeal-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={8}
              placeholder="Explica por qué consideras que la decisión fue incorrecta. Incluye cualquier evidencia o contexto relevante que pueda ayudar a revisar tu caso..."
              className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-all duration-200 resize-none
                  ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-900/20"
                      : "border-gray-200 focus:border-[#FF9900] focus:ring-[#FF9900]/20 dark:border-gray-600 dark:focus:border-[#FF9900] dark:focus:ring-[#FF9900]/20"
                  } 
                  dark:bg-gray-700 dark:text-gray-100
                  focus:ring-4 focus:outline-none`}
            />

            {/* Character Counter */}
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mínimo 100 caracteres, máximo 500 caracteres
              </p>
              {(() => {
                const isValidLength =
                  reason.length >= 100 && reason.length <= 500;
                const isInvalidLength =
                  reason.length < 100 || reason.length > 500;

                let colorClass = "text-gray-500 dark:text-gray-400";
                if (isInvalidLength) {
                  colorClass = "text-red-500";
                } else if (isValidLength) {
                  colorClass = "text-green-500";
                }

                return (
                  <div className={`text-sm font-medium ${colorClass}`}>
                    {reason.length}/500
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => navigate("/marketplace-refactored/")}
              variant="outline"
              className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                submitting || reason.length < 100 || reason.length > 500
              }
              className="px-8 py-2 bg-[#FF9900] hover:bg-[#FFB84D] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                "Enviar Apelación"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
