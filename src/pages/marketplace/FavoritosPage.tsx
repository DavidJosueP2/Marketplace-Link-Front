import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useUserFavorites, useFavorites } from "@/hooks/use-favorites";
import {
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getCardWithShadowClasses,
} from "@/lib/themeHelpers";

/**
 * FavoritosPage - Página de productos favoritos
 * Integrada con el servicio de favoritos del backend
 */
const FavoritosPage = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, error } = useUserFavorites();
  const { removeFavorite } = useFavorites();
  
  // Obtener theme desde el contexto del layout
  const context = useOutletContext<{ theme?: "light" | "dark" }>();
  const theme = context?.theme || "light";

  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const cardClasses = getCardWithShadowClasses(theme);

  // Función para construir URL de imagen desde el backend
  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '';
    
    // Si ya es una URL completa, devolverla tal cual
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Construir URL desde el backend
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const cleanFileName = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    return `${baseUrl}/${cleanFileName}`;
  };

  const onViewPublication = (publicationId: number) => {
    navigate(`/marketplace-refactored/publication/${publicationId}`);
  };

  const onNavigateToPublications = () => {
    navigate("/marketplace-refactored/publications");
  };

  const handleRemoveFavorite = async (publicationId: number) => {
    try {
      await removeFavorite(publicationId);
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${textPrimary}`}>Mis Favoritos</h1>
          <p className={`text-sm ${textSecondary} mt-1`}>Cargando...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${cardClasses} rounded-lg p-4 h-96 animate-pulse`}>
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${textPrimary}`}>Mis Favoritos</h1>
        </div>
        <div className={`${cardClasses} rounded-lg p-8 text-center`}>
          <p className="text-red-500">Error al cargar favoritos. Por favor intenta nuevamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${textPrimary}`}>Mis Favoritos</h1>
        <p className={`text-sm ${textSecondary} mt-1`}>
          {favorites.length} publicación
          {favorites.length === 1 ? "" : "es"} guardada
          {favorites.length === 1 ? "" : "s"}
        </p>
      </div>

      {favorites.length === 0 ? (
        /* Empty State */
        <div className={`${cardClasses} rounded-lg p-12 text-center`}>
          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-24 h-24 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} rounded-full flex items-center justify-center`}
            >
              <Heart size={48} className="text-gray-400" />
            </div>
            <h3 className={`text-xl font-semibold ${textPrimary}`}>
              No tienes favoritos aún
            </h3>
            <p className={`${textSecondary} max-w-md`}>
              Empieza a guardar publicaciones que te interesen haciendo clic en el
              corazón ❤️
            </p>
            <button
              type="button"
              onClick={onNavigateToPublications}
              className="mt-4 bg-[#FF9900] hover:bg-[#FFB84D] active:bg-[#CC7A00] text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ShoppingBag size={20} />
              Explorar Publicaciones
            </button>
          </div>
        </div>
      ) : (
        /* Publications Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className={`${cardClasses} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200`}
            >
              {/* Imagen */}
              <div className="relative h-48 bg-gray-200">
                {favorite.imageUrls && favorite.imageUrls.length > 0 ? (
                  <img
                    src={getImageUrl(favorite.imageUrls[0])}
                    alt={favorite.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ShoppingBag size={48} className="text-gray-400" />
                  </div>
                )}
                {/* Botón de favorito */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(favorite.publicationId);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                  aria-label="Remover de favoritos"
                >
                  <Heart size={20} className="fill-red-500 text-red-500" />
                </button>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-semibold ${textPrimary} line-clamp-2`}>
                    {favorite.name}
                  </h3>
                  <span className="text-lg font-bold text-[#FF9900] whitespace-nowrap">
                    ${favorite.price.toFixed(2)}
                  </span>
                </div>

                <p className={`text-sm ${textSecondary} line-clamp-2 mb-3`}>
                  {favorite.description}
                </p>

                {/* Información adicional del backend */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`${textSecondary}`}>
                      {favorite.categoryName}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      favorite.type === "PRODUCT"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    }`}>
                      {favorite.type === "PRODUCT" ? "Producto" : "Servicio"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`${textSecondary}`}>
                      Vendedor: {favorite.vendor.username}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      favorite.availability === "AVAILABLE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {favorite.availability === "AVAILABLE" ? "Disponible" : "No disponible"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-400">
                      Publicado: {new Date(favorite.publicationDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-gray-400">
                      Guardado: {new Date(favorite.favoritedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Botón de acción */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => onViewPublication(favorite.publicationId)}
                      className="w-full bg-[#FF9900] hover:bg-[#FFB84D] active:bg-[#CC7A00] text-white font-medium py-2 rounded-lg text-sm transition-all duration-200"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritosPage;
