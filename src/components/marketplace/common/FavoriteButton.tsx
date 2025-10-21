import { Heart } from "lucide-react";
import { usePublicationFavorite } from "@/hooks/use-favorites";

interface FavoriteButtonProps {
  publicationId: number;
  className?: string;
  size?: number;
}

/**
 * Botón de favorito reutilizable
 * Se conecta automáticamente al servicio de favoritos
 * 
 * Uso:
 * <FavoriteButton publicationId={123} />
 */
export function FavoriteButton({ 
  publicationId, 
  className = "",
  size = 20 
}: FavoriteButtonProps) {
  const { isFavorite, isLoading, toggleFavorite } = usePublicationFavorite(publicationId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el click se propague al contenedor padre
    toggleFavorite();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      aria-label={isFavorite ? "Remover de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        size={size}
        className={`transition-all ${
          isFavorite 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-600 hover:text-red-500'
        }`}
      />
    </button>
  );
}
