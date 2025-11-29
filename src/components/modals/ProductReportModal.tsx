import { X, Send, Loader2, AlertTriangle } from "lucide-react";

/**
 * ProductReportModal - Modal para reportar problemas con un producto
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.product - Producto que se está reportando
 * @param {Object} props.formData - Datos del formulario de reporte
 * @param {Function} props.onFormChange - Callback para actualizar campos del formulario
 * @param {Function} props.onSubmit - Callback para enviar el reporte
 * @param {boolean} props.isSubmitting - Indica si se está enviando el reporte
 * @param {Array} props.motivosReporte - Lista de motivos de reporte disponibles
 */
const ProductReportModal = ({
  isOpen,
  onClose,
  product,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting = false,
  motivosReporte = [
    "Información incorrecta",
    "Producto no disponible",
    "Precio incorrecto",
    "Descripción engañosa",
    "Contenido inapropiado",
    "Spam o fraude",
    "Otro",
  ],
}) => {
  if (!isOpen || !product) return null;

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
    if (!isSubmitting) {
      onSubmit();
    }
  };

  const isFormValid = () => {
    return formData.motivo?.trim() && formData.descripcion?.trim();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold mb-1">🚨 Reportar Producto</h2>
            <p className="text-sm opacity-90">
              Ayúdanos a mantener la calidad del marketplace
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

        {/* Product Info */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
          <div className="flex items-start gap-4">
            {product.imagen && (
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80?text=Producto";
                }}
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                {product.nombre}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.categoria} • ${product.precio}
              </p>
              {product.hospital?.nombre && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Vendedor: {product.hospital.nombre}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
          {/* Motivo del reporte */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Motivo del reporte <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.motivo || ""}
              onChange={(e) => handleInputChange("motivo", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">Seleccionar motivo</option>
              {motivosReporte.map((motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción detallada */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Descripción del problema <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.descripcion || ""}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              disabled={isSubmitting}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Describe con detalle el problema que encontraste con este producto..."
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Proporciona la mayor cantidad de detalles posible
            </p>
          </div>

          {/* Info notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Información importante:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Tu reporte será revisado por nuestro equipo</li>
                  <li>Recibirás una respuesta en 24-48 horas</li>
                  <li>Los reportes falsos pueden resultar en sanciones</li>
                </ul>
              </div>
            </div>
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
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Enviando reporte...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar Reporte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductReportModal;
