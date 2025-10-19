import { Heart } from "lucide-react";

/**
 * ProductCard - Tarjeta reutilizable para mostrar un producto
 *
 * @param {Object} props
 * @param {Object} props.producto - Datos del producto
 * @param {boolean} props.isFavorite - Indica si está en favoritos
 * @param {Function} props.onView - Callback al hacer click en "Ver Detalles"
 * @param {Function} props.onToggleFavorite - Callback al agregar/quitar de favoritos
 * @param {Function} props.getEstadoColor - Función para obtener color según estado
 */
const ProductCard = ({
  producto,
  isFavorite = false,
  onView,
  onToggleFavorite,
  getEstadoColor,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden group">
      {/* Imagen del producto */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl relative overflow-hidden">
        {producto.imagen}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Header con título y estado */}
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-semibold text-lg line-clamp-1"
            title={producto.nombre}
          >
            {producto.nombre}
          </h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(producto.estado)}`}
          >
            {producto.estado}
          </span>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {producto.descripcion}
        </p>

        {/* Precio y ubicación */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-brand">
            ${producto.precio}
          </span>
          <span className="text-sm text-gray-500">{producto.ubicacion}</span>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(producto)}
            className="flex-1 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white py-2 rounded-lg text-sm transition-colors"
          >
            Ver Detalles
          </button>
          <button
            onClick={() => onToggleFavorite(producto)}
            className={`px-3 py-2 border-2 rounded-lg transition-all duration-300 ${
              isFavorite
                ? "border-red-500 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              size={18}
              className={isFavorite ? "fill-red-500 text-red-500" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
