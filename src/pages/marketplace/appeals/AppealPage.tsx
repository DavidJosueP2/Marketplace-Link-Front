import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { FileWarning } from "lucide-react";
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

        const message =
          payload?.message ||
          payload?.data?.detail ||
          "No se pudo enviar la apelación.";
        setError(message);
      } else {
        setError("Error inesperado al enviar la apelación.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold !text-black dark:!text-gray-100">
            Apelar decisión
          </h1>
        </div>
      </header>

      {/* Card principal */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <FileWarning className="text-orange-500 w-6 h-6" />
          <div>
            <p className="text-gray-700 dark:text-gray-200 font-medium">
              Publicación:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {publicationName
                  ? publicationName
                  : "Publicación desconocida..."}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Si consideras que la decisión fue incorrecta, explica los motivos
              de tu apelación a continuación.
            </p>
          </div>
        </div>

        {/* Campo de motivo */}
        <div className="space-y-2">
          <label
            htmlFor="appeal-reason"
            className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
          >
            Motivo de apelación
          </label>
          <textarea
            id="appeal-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={7}
            placeholder="Describe con detalle los motivos de tu apelación. Debe tener entre 100 y 500 caracteres."
            className={`w-full rounded-lg border px-3 py-2 text-sm transition-all
              ${
                error
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[#FF9900]"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
              focus:ring-2 focus:outline-none`}
          />
          <div
            className={`text-xs text-right ${
              reason.length < 100 || reason.length > 500
                ? "text-red-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {reason.length}/500 caracteres
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className={`text-sm px-3 py-2 rounded-lg border ${
              error
                ? "text-red-700 bg-red-100 border-red-300 dark:text-red-100 dark:bg-[#3F1E1E] dark:border-[#5C1F1F]"
                : ""
            }`}
          >
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#FF9900] hover:bg-[#FFB84D] text-white"
          >
            {submitting ? "Enviando..." : "Enviar apelación"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
