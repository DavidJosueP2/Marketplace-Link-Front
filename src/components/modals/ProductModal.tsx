import {
  X,
  Heart,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Calendar,
} from "lucide-react";

/**
 * ProductModal - Modal para visualizar detalles completos de un producto
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.product - Datos del producto a mostrar
 * @param {boolean} props.isFavorite - Indica si el producto está en favoritos
 * @param {Function} props.onToggleFavorite - Callback para agregar/quitar de favoritos
 * @param {Function} props.onReport - Callback para abrir modal de reporte
 */
const ProductModal = ({
  isOpen,
  onClose,
  product,
  isFavorite = false,
  onToggleFavorite,
  onReport,
}) => {
  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{product.nombre}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                {product.categoria}
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-medium">
                ${product.precio}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onToggleFavorite(product)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isFavorite
                  ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600"
              }`}
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Imagen */}
          {product.imagen && (
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Sin+Imagen";
                }}
              />
            </div>
          )}

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              📝 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.descripcion || "Sin descripción disponible"}
            </p>
          </div>

          {/* Información del vendedor */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              👤 Información del Vendedor
            </h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Nombre:</span>
                {product.hospital?.nombre || "No especificado"}
              </p>
              {product.hospital?.ubicacion && (
                <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin size={16} className="text-blue-600" />
                  {product.hospital.ubicacion}
                </p>
              )}
              {product.hospital?.telefono && (
                <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone size={16} className="text-green-600" />
                  {product.hospital.telefono}
                </p>
              )}
              {product.hospital?.email && (
                <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="text-purple-600" />
                  {product.hospital.email}
                </p>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Stock disponible
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.stock || 0} unidades
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Publicado
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={16} />
                {product.fecha_creacion
                  ? new Date(product.fecha_creacion).toLocaleDateString("es-ES")
                  : "Fecha no disponible"}
              </p>
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
            <button
              onClick={() => onReport(product)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
            >
              <AlertTriangle size={20} />
              Reportar Producto
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
