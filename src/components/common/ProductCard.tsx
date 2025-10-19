import { Heart } from "lucide-react";
import {
  getCardWithShadowClasses,
  getTextPrimaryClasses,
  getTextSecondaryClasses,
} from "@/lib/themeHelpers";

interface ProductCardProps {
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    ubicacion: string;
    estado: string;
    imagen: string;
  };
  isFavorite?: boolean;
  onView: (producto: ProductCardProps["producto"]) => void;
  onToggleFavorite: (producto: ProductCardProps["producto"]) => void;
  getEstadoColor: (estado: string) => string;
  theme: "light" | "dark";
}

const ProductCard = ({
  producto,
  isFavorite = false,
  onView,
  onToggleFavorite,
  getEstadoColor,
  theme,
}: ProductCardProps) => {
  const cardClasses = getCardWithShadowClasses(theme);
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);

  return (
    <div
      className={`${cardClasses} rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden group`}
    >
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
            className={`font-semibold text-lg line-clamp-1 ${textPrimary}`}
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
        <p className={`text-sm ${textSecondary} mb-3 line-clamp-2`}>
          {producto.descripcion}
        </p>

        {/* Precio y ubicación */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-[#FF9900]">
            ${producto.precio}
          </span>
          <span className={`text-sm ${textSecondary}`}>
            {producto.ubicacion}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onView(producto)}
            className="flex-1 bg-[#FF9900] hover:bg-[#FFB84D] active:bg-[#CC7A00] text-white font-medium py-2 rounded-lg text-sm transition-all duration-200"
          >
            Ver Detalles
          </button>
          <button
            type="button"
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
