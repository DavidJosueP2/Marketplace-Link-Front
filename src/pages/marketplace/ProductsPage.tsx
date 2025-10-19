import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Store, SlidersHorizontal, Package } from "lucide-react";
import { ProductCard, Pagination, ProductoSkeleton } from "@/components/common";
import FilterPanel from "@/components/common/FilterPanel";

/**
 * ProductsPage - Página del catálogo de productos con filtros
 */
const ProductsPage = () => {
  const {
    productos = [],
    favoritos = [],
    filters,
    toggleFavorite,
    getEstadoColor,
    isLoadingProducts = false,
  } = useOutletContext();

  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  const onViewProduct = (producto) => {
    console.log("Ver producto:", producto);
  };

  const onPublicar = () => {
    console.log("Publicar producto");
  };

  // Aplicar filtros
  const productosFiltrados = productos.filter((p) => {
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

  const handlePageChange = (page) => {
    filters.setCurrentPageProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex gap-6">
      {/* Filter Panel Sidebar */}
      <div className={`${showFilterSidebar ? "block" : "hidden"} lg:block`}>
        <FilterPanel filters={filters} productos={productos} isVisible={true} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Mostrando {startIndex + 1}-
              {Math.min(endIndex, productosFiltrados.length)} de{" "}
              {productosFiltrados.length} productos
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilterSidebar(!showFilterSidebar)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SlidersHorizontal size={20} />
              Filtros
            </button>
            <button
              onClick={onPublicar}
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 hover:scale-105 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Store size={20} />
              Publicar Producto
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${!isLoadingProducts ? "animate-fade-in-up" : ""}`}
        >
          {isLoadingProducts ? (
            <>
              {[...Array(6)].map((_, i) => (
                <ProductoSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {productosPaginados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  isFavorite={favoritos.includes(producto.id)}
                  onView={onViewProduct}
                  onToggleFavorite={toggleFavorite}
                  getEstadoColor={getEstadoColor}
                />
              ))}
            </>
          )}
        </div>

        {/* Empty State */}
        {!isLoadingProducts && productosFiltrados.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Intenta ajustar los filtros de búsqueda
            </p>
            <button
              onClick={() => filters.clearFilters()}
              className="text-brand hover:underline"
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
            onItemsPerPageChange={(value) => {
              filters.setItemsPerPageProducts(value);
              filters.setCurrentPageProducts(1);
            }}
            totalItems={productosFiltrados.length}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
