import { Eye, Heart, Edit, MapPin, DollarSign } from "lucide-react";
import { getCategoriaColor } from "../../../lib/marketplaceUtils";

const ProductCard = ({
  producto,
  onView,
  onToggleFavorite,
  onEdit,
  isFavorite = false,
  canEdit = false,
  showActions = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
        <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
          {producto.imagen}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoriaColor(producto.categoria)}`}
          >
            {producto.categoria}
          </span>
        </div>

        {/* Favorite Badge */}
        {isFavorite && (
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Availability Badge */}
        {!producto.disponibilidad && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg">
              No Disponible
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate mb-2">
          {producto.nombre}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {producto.descripcion}
        </p>

        {/* Location and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{producto.ubicacion}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-lg">
            <DollarSign className="w-5 h-5" />
            <span>{producto.precio}</span>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {producto.vendedor.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Vendedor</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {producto.vendedor}
            </p>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={() => onView(producto)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              <Eye className="w-4 h-4" />
              <span>Ver</span>
            </button>

            {canEdit ? (
              <button
                onClick={() => onEdit(producto)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                title="Editar producto"
              >
                <Edit className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onToggleFavorite(producto)}
                className={`px-4 py-2.5 rounded-lg transition-colors ${
                  isFavorite
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title={
                  isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
                }
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
