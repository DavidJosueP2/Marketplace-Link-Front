import { AlertTriangle, X } from "lucide-react";

interface DeletePublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  publicationName: string;
  isDeleting?: boolean;
  theme?: "light" | "dark";
}

/**
 * DeletePublicationModal - Modal de confirmación para eliminar publicación
 * Muestra advertencia y requiere confirmación explícita del usuario
 */
const DeletePublicationModal = ({
  isOpen,
  onClose,
  onConfirm,
  publicationName,
  isDeleting = false,
  theme = "light",
}: DeletePublicationModalProps) => {
  if (!isOpen) return null;

  const bgOverlay = "bg-black bg-opacity-20"; // Reducido de 50 a 20
  const bgModal = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${bgOverlay} backdrop-blur-[1px]`}
      onClick={onClose}
    >
      <div
        className={`${bgModal} rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${borderClass} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              Confirmar Eliminación
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`p-1 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          <div className={`${textSecondary} space-y-3`}>
            <p className="text-base">
              ¿Estás seguro de que deseas eliminar la publicación?
            </p>
            
            <div className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
            }`}>
              <p className={`font-semibold ${textPrimary} mb-1`}>
                {publicationName}
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                ⚠️ Esta acción no se puede deshacer
              </p>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                La publicación será eliminada permanentemente y no podrás recuperarla.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${borderClass} flex gap-3 justify-end`}>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                Eliminar Publicación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePublicationModal;
