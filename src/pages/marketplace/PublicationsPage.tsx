import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { SlidersHorizontal, Package } from "lucide-react";
import { usePublications } from "@/hooks/use-publication";
import { useIsFavorite, useFavorites } from "@/hooks/use-favorites";
import { getUserLocation } from "@/auth/userStorage";
import PublicationCard from "@/components/common/publications/PublicationCard";
import PublicationFilterPanel from "@/components/common/publications/PublicationFilterPanel";
import Pagination from "@/components/common/Pagination";
import { ProductoSkeleton } from "@/components/common/Skeletons";
import {
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getCardWithShadowClasses,
  getBorderClasses,
} from "@/lib/themeHelpers";
import type { PublicationSummary } from "@/services/publications/interfaces/PublicationSummary";

/**
 * Wrapper component que conecta PublicationCard con el sistema de favoritos del backend
 */
interface PublicationCardWrapperProps {
  publication: PublicationSummary;
  onView: (publication: PublicationSummary) => void;
  theme: "light" | "dark";
}

function PublicationCardWrapper({ publication, onView, theme }: Readonly<PublicationCardWrapperProps>) {
  const { isFavorite } = useIsFavorite(publication.id);
  const { toggleFavorite } = useFavorites();

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(publication.id);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <PublicationCard
      publication={publication}
      isFavorite={isFavorite}
      onView={onView}
      onToggleFavorite={handleToggleFavorite}
      theme={theme}
    />
  );
}

const PublicationsPage = () => {
  const navigate = useNavigate();

  // Get theme from layout context
  const context = useOutletContext<{ theme?: "light" | "dark" }>();
  const theme = context?.theme || "light";
  
  // Filter states
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null); // null = sin filtro de distancia
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  // Get user location
  const userLocation = getUserLocation();

  // Fetch publications with filters
  const { data, isLoading, error } = usePublications({
    page: currentPage,
    size: itemsPerPage,
    categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < 10000 ? maxPrice : undefined,
    lat: userLocation.latitude,
    lon: userLocation.longitude,
    distanceKm: selectedDistance ?? undefined, // null o undefined = sin filtro
  });

  // Theme classes
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const cardClasses = getCardWithShadowClasses(theme);
  const borderClass = getBorderClasses(theme);

  const publications = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // Convert to 0-based index
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(0);
  };

  const handleViewPublication = (publication: PublicationSummary) => {
    // Limpiar flag ya que viene desde el catálogo público
    sessionStorage.removeItem('fromMyProducts');
    navigate(`/marketplace-refactored/publication/${publication.id}`);
  };

  const handleClearFilters = () => {
    setSelectedCategoryIds([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setSelectedDistance(null); // Resetear a null para quitar el filtro
    setCurrentPage(0);
  };

  const filters = {
    selectedCategoryIds,
    minPrice,
    maxPrice,
    selectedDistance,
    setSelectedCategoryIds,
    setPriceRange: (min: number, max: number) => {
      setMinPrice(min);
      setMaxPrice(max);
    },
    setSelectedDistance,
    clearFilters: handleClearFilters,
  };

  if (error) {
    return (
      <div className={`${cardClasses} text-center py-16`}>
        <p className={`${textPrimary} text-xl`}>
          Error al cargar las publicaciones
        </p>
        <p className={`${textSecondary} mt-2`}>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Filter Panel Sidebar */}
      <div
        className={`${showFilterSidebar ? "block" : "hidden"} lg:block transition-all duration-300`}
      >
        <PublicationFilterPanel
          filters={filters}
          isVisible={true}
          theme={theme}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-[#FF9900] dark:text-[#FFB84D] text-2xl sm:text-3xl lg:text-4xl font-bold italic mb-2">
              ¡Bienvenido! Explora diferentes servicios y productos en nuestra plataforma.
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilterSidebar(!showFilterSidebar)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2 border ${borderClass} rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
            >
              <SlidersHorizontal size={20} />
              <span className="text-sm sm:text-base">Filtros</span>
            </button>
          </div>
        </div>

        {/* Publications Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${isLoading ? "" : "animate-fade-in-up"}`}
        >
          {isLoading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <ProductoSkeleton key={`skeleton-publication-${i}`} />
              ))}
            </>
          ) : (
            <>
              {publications.map((publication) => (
                <PublicationCardWrapper
                  key={publication.id}
                  publication={publication}
                  onView={handleViewPublication}
                  theme={theme}
                />
              ))}
            </>
          )}
        </div>

        {/* Empty State */}
        {!isLoading && publications.length === 0 && (
          <div className={`${cardClasses} text-center py-16`}>
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className={`${textPrimary} text-xl font-semibold mb-2`}>
              No se encontraron publicaciones
            </h3>
            <p className={`${textSecondary} mb-4`}>
              Intenta ajustar los filtros de búsqueda
            </p>
            <button
              onClick={handleClearFilters}
              className="text-[#FF9900] hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && publications.length > 0 && (
          <Pagination
            currentPage={currentPage + 1} // Convert back to 1-based for display
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={totalElements}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;
