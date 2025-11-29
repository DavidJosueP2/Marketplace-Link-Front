import { useState } from "react";
import { Menu } from "lucide-react";
import { ProductCard, ProductFilterSidebar } from "../products";
import { Pagination } from "../common";
import { useProductFilters } from "../../hooks/marketplace";

const ProductsView = ({
  productos = [],
  currentUser = null,
  onEditProduct = () => {},
  onDeleteProduct = () => {},
  onToggleFavorite = () => {},
  onViewProduct = () => {},
}) => {
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(1500);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [soloDisponibles, setSoloDisponibles] = useState(true);
  const [ubicacionesSeleccionadas, setUbicacionesSeleccionadas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Use custom filter hook
  const filteredProductos = useProductFilters(productos, {
    precioMin,
    precioMax,
    categorias: categoriasSeleccionadas,
    disponibles: soloDisponibles,
    ubicaciones: ubicacionesSeleccionadas,
    busqueda: searchQuery,
  });

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProductos.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setFilterSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <ProductFilterSidebar
          isOpen={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
          precioMin={precioMin}
          setPrecioMin={setPrecioMin}
          precioMax={precioMax}
          setPrecioMax={setPrecioMax}
          categoriasSeleccionadas={categoriasSeleccionadas}
          setCategoriasSeleccionadas={setCategoriasSeleccionadas}
          soloDisponibles={soloDisponibles}
          setSoloDisponibles={setSoloDisponibles}
          ubicacionesSeleccionadas={ubicacionesSeleccionadas}
          setUbicacionesSeleccionadas={setUbicacionesSeleccionadas}
          onApply={handleApplyFilters}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Productos
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredProductos.length} productos encontrados
                </p>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setFilterSidebarOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Menu className="w-5 h-5" />
                Filtros
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Active Filters */}
          {(categoriasSeleccionadas.length > 0 ||
            ubicacionesSeleccionadas.length > 0 ||
            searchQuery ||
            precioMin > 0 ||
            precioMax < 1500) && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Filtros activos:{" "}
                {categoriasSeleccionadas.length +
                  ubicacionesSeleccionadas.length +
                  (searchQuery ? 1 : 0) +
                  (precioMin > 0 || precioMax < 1500 ? 1 : 0)}
              </p>
              <div className="flex flex-wrap gap-2">
                {categoriasSeleccionadas.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {cat}
                  </span>
                ))}
                {ubicacionesSeleccionadas.map((ub) => (
                  <span
                    key={ub}
                    className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    📍 {ub}
                  </span>
                ))}
                {searchQuery && (
                  <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                    🔍 {searchQuery}
                  </span>
                )}
                {(precioMin > 0 || precioMax < 1500) && (
                  <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                    💵 ${precioMin} - ${precioMax}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
                {paginatedProducts.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    isFavorite={currentUser?.favoritos?.includes(producto.id)}
                    onFavorite={() => onToggleFavorite(producto.id)}
                    onView={() => onViewProduct(producto.id)}
                    onEdit={
                      currentUser?.rol === "admin"
                        ? () => onEditProduct(producto.id)
                        : null
                    }
                    onDelete={
                      currentUser?.rol === "admin"
                        ? () => onDeleteProduct(producto.id)
                        : null
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Intenta ajustar tus filtros para ver más productos.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoriasSeleccionadas([]);
                  setUbicacionesSeleccionadas([]);
                  setPrecioMin(0);
                  setPrecioMax(1500);
                  setSoloDisponibles(true);
                  setCurrentPage(1);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsView;
