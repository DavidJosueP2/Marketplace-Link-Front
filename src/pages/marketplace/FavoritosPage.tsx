import { Heart, ShoppingBag } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/common";
import {
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getCardWithShadowClasses,
} from "@/lib/themeHelpers";

interface OutletContextType {
  productos: Array<{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    ubicacion: string;
    estado: string;
    imagen: string;
    categoria?: string;
  }>;
  favoritos: number[];
  toggleFavorite: (producto: OutletContextType["productos"][0]) => void;
  getEstadoColor: (estado: string) => string;
  theme: "light" | "dark";
}

/**
 * FavoritosPage - Página de productos favoritos
 */
const FavoritosPage = () => {
  const {
    productos = [],
    favoritos = [],
    toggleFavorite,
    getEstadoColor,
    theme,
  } = useOutletContext<OutletContextType>();

  const navigate = useNavigate();

  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const cardClasses = getCardWithShadowClasses(theme);

  const onViewProduct = (producto: OutletContextType["productos"][0]) => {
    navigate(`/marketplace-refactored/producto/${producto.id}`);
  };

  const onNavigateToProducts = () => {
    navigate("/marketplace-refactored/productos");
  };

  const productosFavoritos = productos.filter((p) => favoritos.includes(p.id));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${textPrimary}`}>Mis Favoritos</h1>
        <p className={`text-sm ${textSecondary} mt-1`}>
          {productosFavoritos.length} producto
          {productosFavoritos.length === 1 ? "" : "s"} guardado
          {productosFavoritos.length === 1 ? "" : "s"}
        </p>
      </div>

      {productosFavoritos.length === 0 ? (
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
              Empieza a guardar productos que te interesen haciendo clic en el
              corazón ❤️
            </p>
            <button
              type="button"
              onClick={onNavigateToProducts}
              className="mt-4 bg-[#FF9900] hover:bg-[#FFB84D] active:bg-[#CC7A00] text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
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
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritosPage;
