import { X, Save, Loader2 } from "lucide-react";

/**
 * ProductEditModal - Modal para editar un producto existente
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.formData - Datos del formulario de edición
 * @param {Function} props.onFormChange - Callback para actualizar campos del formulario
 * @param {Function} props.onSubmit - Callback para enviar el formulario
 * @param {boolean} props.isSubmitting - Indica si se está enviando el formulario
 * @param {Array} props.categorias - Lista de categorías disponibles
 */
const ProductEditModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting = false,
  categorias = [],
}) => {
  if (!isOpen || !formData) return null;

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
    return (
      formData.nombre?.trim() &&
      formData.descripcion?.trim() &&
      formData.precio > 0 &&
      formData.stock >= 0 &&
      formData.categoria?.trim()
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold">✏️ Editar Producto</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
          {/* Nombre del producto */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre || ""}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ej: Silla de ruedas premium"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.descripcion || ""}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Describe las características del producto..."
              required
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Precio (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.precio || ""}
                onChange={(e) =>
                  handleInputChange("precio", parseFloat(e.target.value) || 0)
                }
                disabled={isSubmitting}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Stock disponible <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.stock || ""}
                onChange={(e) =>
                  handleInputChange("stock", parseInt(e.target.value) || 0)
                }
                disabled={isSubmitting}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoria || ""}
              onChange={(e) => handleInputChange("categoria", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* URL de imagen */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              URL de la imagen (opcional)
            </label>
            <input
              type="url"
              value={formData.imagen || ""}
              onChange={(e) => handleInputChange("imagen", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
