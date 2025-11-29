import { X, Send, Loader2, MessageSquare } from "lucide-react";

/**
 * AppealModal - Modal para presentar una apelación sobre una incidencia rechazada
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.incidence - Incidencia que se está apelando
 * @param {Object} props.formData - Datos del formulario de apelación
 * @param {Function} props.onFormChange - Callback para actualizar campos del formulario
 * @param {Function} props.onSubmit - Callback para enviar la apelación
 * @param {boolean} props.isSubmitting - Indica si se está enviando la apelación
 */
const AppealModal = ({
  isOpen,
  onClose,
  incidence,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting = false,
}) => {
  if (!isOpen || !incidence) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isSubmitting && formData.descripcion?.trim()) {
      onSubmit();
    }
  };

  const isFormValid = () => {
    return formData.descripcion?.trim() && formData.descripcion.length >= 50;
  };

  const remainingChars = 50 - (formData.descripcion?.length || 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <MessageSquare size={28} />
              Presentar Apelación
            </h2>
            <p className="text-sm opacity-90">
              Explica por qué consideras que tu reporte debe ser reconsiderado
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Incidence Summary */}
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
            Incidencia Rechazada
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs text-red-700 dark:text-red-400 font-medium min-w-[80px]">
                Producto:
              </span>
              <span className="text-sm text-red-900 dark:text-red-200">
                {incidence.producto?.nombre || "N/A"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-red-700 dark:text-red-400 font-medium min-w-[80px]">
                Motivo:
              </span>
              <span className="text-sm text-red-900 dark:text-red-200">
                {incidence.motivo}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-red-700 dark:text-red-400 font-medium min-w-[80px]">
                Tu reporte:
              </span>
              <span className="text-sm text-red-900 dark:text-red-200 line-clamp-2">
                {incidence.descripcion}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
          {/* Apelación */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Argumenta tu apelación <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.descripcion || ""}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              disabled={isSubmitting}
              rows={8}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Explica detalladamente:&#10;• Por qué consideras que tu reporte es válido&#10;• Qué evidencia adicional puedes proporcionar&#10;• Por qué el rechazo fue incorrecto&#10;&#10;Sé claro, específico y profesional en tu argumentación."
              required
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mínimo 50 caracteres para una apelación válida
              </p>
              <p
                className={`text-xs font-medium ${
                  remainingChars > 0
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {remainingChars > 0
                  ? `Faltan ${remainingChars} caracteres`
                  : `${formData.descripcion?.length || 0} caracteres`}
              </p>
            </div>
          </div>

          {/* Consejos */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 Consejos para una apelación exitosa:
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Sé específico y proporciona detalles concretos</li>
              <li>• Aporta evidencia o ejemplos que respalden tu caso</li>
              <li>• Mantén un tono respetuoso y profesional</li>
              <li>• Explica claramente por qué el rechazo fue incorrecto</li>
              <li>• Si tienes capturas de pantalla o enlaces, menciónalo</li>
            </ul>
          </div>

          {/* Advertencia */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-xs text-orange-800 dark:text-orange-200">
              ⚠️ <strong>Importante:</strong> Solo puedes presentar una
              apelación por incidencia. Las apelaciones falsas o abusivas pueden
              resultar en la suspensión de tu cuenta.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Enviando apelación...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar Apelación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppealModal;
