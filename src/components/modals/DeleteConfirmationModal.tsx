import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

/**
 * DeleteConfirmationModal - Modal genérico y reutilizable para confirmación de eliminación
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onConfirm - Callback para confirmar la eliminación
 * @param {boolean} props.isDeleting - Indica si se está procesando la eliminación
 * @param {string} props.title - Título del modal
 * @param {string} props.message - Mensaje de confirmación
 * @param {string} props.itemName - Nombre del elemento a eliminar (opcional)
 * @param {string} props.warningMessage - Mensaje de advertencia adicional (opcional)
 * @param {string} props.confirmButtonText - Texto del botón de confirmación (default: "Eliminar")
 * @param {string} props.cancelButtonText - Texto del botón de cancelar (default: "Cancelar")
 */
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "¿Confirmar eliminación?",
  message = "¿Estás seguro de que deseas eliminar este elemento?",
  itemName,
  warningMessage = "Esta acción no se puede deshacer.",
  confirmButtonText = "Eliminar",
  cancelButtonText = "Cancelar",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isDeleting) {
      onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mx-auto mb-4">
            <AlertTriangle
              className="text-red-600 dark:text-red-400"
              size={32}
            />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
            {message}
          </p>

          {/* Item name (if provided) */}
          {itemName && (
            <p className="text-center mb-4">
              <span className="font-semibold text-gray-900 dark:text-white text-lg">
                "{itemName}"
              </span>
            </p>
          )}

          {/* Warning message */}
          {warningMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <span>{warningMessage}</span>
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 size={20} />
                  {confirmButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
