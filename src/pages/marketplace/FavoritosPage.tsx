import { Heart, ShoppingBag } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/common";

/**
 * FavoritosPage - Página de productos favoritos
 */
const FavoritosPage = () => {
  const {
    productos = [],
    favoritos = [],
    toggleFavorite,
    getEstadoColor,
  } = useOutletContext();

  const navigate = useNavigate();

  const onViewProduct = (producto) => {
    console.log("Ver producto:", producto);
  };

  const onNavigateToProducts = () => {
    navigate("/marketplace-refactored/productos");
  };

  const productosFavoritos = productos.filter((p) => favoritos.includes(p.id));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mis Favoritos</h1>
        <p className="text-sm text-gray-500 mt-1">
          {productosFavoritos.length} producto
          {productosFavoritos.length !== 1 ? "s" : ""} guardado
          {productosFavoritos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {productosFavoritos.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold">No tienes favoritos aún</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Empieza a guardar productos que te interesen haciendo clic en el
              corazón ❤️
            </p>
            <button
              onClick={onNavigateToProducts}
              className="mt-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 hover:scale-105 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <ShoppingBag size={20} />
              Explorar Productos
            </button>
          </div>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
          {productosFavoritos.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              isFavorite={true}
              onView={onViewProduct}
              onToggleFavorite={toggleFavorite}
              getEstadoColor={getEstadoColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritosPage;
