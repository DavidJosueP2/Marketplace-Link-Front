import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Store, SlidersHorizontal, Package } from "lucide-react";
import { ProductCard, Pagination, ProductoSkeleton } from "@/components/common";
import FilterPanel from "@/components/common/FilterPanel";
import {
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getCardWithShadowClasses,
  getBorderClasses,
} from "@/lib/themeHelpers";

/**
 * ProductsPage - Página del catálogo de productos con filtros
 */
const ProductsPage = () => {
  const navigate = useNavigate();
  const {
    productos = [],
    favoritos = [],
    filters,
    toggleFavorite,
    getEstadoColor,
    isLoadingProducts = false,
    theme = "light",
  } = useOutletContext<{
    productos: any[];
    favoritos: number[];
    filters: any;
    toggleFavorite: (id: number) => void;
    getEstadoColor: (estado: string) => string;
    isLoadingProducts: boolean;
    theme: "light" | "dark";
  }>();

  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  // Obtener clases del tema
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const cardClasses = getCardWithShadowClasses(theme);
  const borderClass = getBorderClasses(theme);

  const onViewProduct = (producto: any) => {
    navigate(`/marketplace-refactored/producto/${producto.id}`);
  };

  const onPublicar = () => {
    console.log("Publicar producto");
  };

  // Aplicar filtros
  const productosFiltrados = productos.filter((p: any) => {
    // Filtro por categorías
    if (
      filters.categoriasSeleccionadas.length > 0 &&
      !filters.categoriasSeleccionadas.includes(p.categoria)
    ) {
      return false;
    }

    // Filtro por precio
    if (p.precio < filters.precioMin || p.precio > filters.precioMax) {
      return false;
    }

    // Filtro por disponibilidad
    if (filters.soloDisponibles && p.stock === 0) {
      return false;
    }

    // Filtro por ubicación
    if (
      filters.ubicacionesSeleccionadas.length > 0 &&
      !filters.ubicacionesSeleccionadas.includes(p.ubicacion)
    ) {
      return false;
    }

    return true;
  });

  // Cálculos de paginación
  const totalPages = Math.ceil(
    productosFiltrados.length / filters.itemsPerPageProducts,
  );
  const startIndex =
    (filters.currentPageProducts - 1) * filters.itemsPerPageProducts;
  const endIndex = startIndex + filters.itemsPerPageProducts;
  const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    filters.setCurrentPageProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Filter Panel Sidebar */}
      <div
        className={`${showFilterSidebar ? "block" : "hidden"} lg:block transition-all duration-300`}
      >
        <FilterPanel
          filters={filters}
          productos={productos as never[]}
          isVisible={true}
          theme={theme}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className={`${textPrimary} text-2xl sm:text-3xl font-bold`}>
              Catálogo de Productos
            </h1>
            <p className={`${textSecondary} text-xs sm:text-sm mt-1`}>
              Mostrando {startIndex + 1}-
              {Math.min(endIndex, productosFiltrados.length)} de{" "}
              {productosFiltrados.length} productos
            </p>
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={() => setShowFilterSidebar(!showFilterSidebar)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2 border ${borderClass} rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors flex-1 sm:flex-initial justify-center`}
            >
              <SlidersHorizontal size={20} />
              <span className="text-sm sm:text-base">Filtros</span>
            </button>
            <button
              type="button"
              onClick={onPublicar}
              className="bg-[#FF9900] hover:bg-[#FFB84D] active:bg-[#CC7A00] text-white font-medium px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg flex-1 sm:flex-initial justify-center whitespace-nowrap"
            >
              <Store size={20} />
              <span className="text-sm sm:text-base">Publicar Producto</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${isLoadingProducts ? "" : "animate-fade-in-up"}`}
        >
          {isLoadingProducts ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <ProductoSkeleton key={`skeleton-producto-${i}`} />
              ))}
            </>
          ) : (
            <>
              {productosPaginados.map((producto: any) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  isFavorite={favoritos.includes(producto.id)}
                  onView={onViewProduct}
                  onToggleFavorite={toggleFavorite}
                  getEstadoColor={getEstadoColor}
                  theme={theme}
                />
              ))}
            </>
          )}
        </div>

        {/* Empty State */}
        {!isLoadingProducts && productosFiltrados.length === 0 && (
          <div className={`${cardClasses} text-center py-16`}>
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className={`${textPrimary} text-xl font-semibold mb-2`}>
              No se encontraron productos
            </h3>
            <p className={`${textSecondary} mb-4`}>
              Intenta ajustar los filtros de búsqueda
            </p>
            <button
              onClick={() => filters.clearFilters()}
              className="text-[#FF9900] hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isLoadingProducts && productosFiltrados.length > 0 && (
          <Pagination
            currentPage={filters.currentPageProducts}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={filters.itemsPerPageProducts}
            onItemsPerPageChange={(value: number) => {
              filters.setItemsPerPageProducts(value);
              filters.setCurrentPageProducts(1);
            }}
            totalItems={productosFiltrados.length}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
