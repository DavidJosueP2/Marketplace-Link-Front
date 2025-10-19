import {
  Store,
  Edit,
  Trash2,
  Eye,
  Heart,
  MapPin,
} from "lucide-react";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  estado: string;
  disponibilidad: boolean;
  ubicacion: string;
}

interface MisProductosPageProps {
  productos?: Producto[];
  favoritos?: number[];
  onViewProduct: (producto: Producto) => void;
  onEditProduct: (producto: Producto) => void;
  onDeleteProduct: (producto: Producto) => void;
  onNavigateToPublicar: () => void;
  getEstadoColor: (estado: string) => string;
  isLoading?: boolean;
}

/**
 * MisProductosPage - Página de gestión de productos del vendedor
 */
const MisProductosPage = ({
  productos = [],
  favoritos = [],
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onNavigateToPublicar,
  getEstadoColor,
  isLoading = false,
}: MisProductosPageProps) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Productos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona tu inventario de productos publicados
          </p>
        </div>
        <button
          onClick={onNavigateToPublicar}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 hover:scale-105 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Store size={20} />
          Nuevo Producto
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={`skeleton-producto-${i}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {productos.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No tienes productos publicados
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Comienza a vender publicando tu primer producto
              </p>
              <button
                onClick={onNavigateToPublicar}
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all"
              >
                <Store size={20} />
                Publicar Producto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {producto.imagen}
                </span>
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(producto.estado)}`}
                  >
                    {producto.estado}
                  </span>
                </div>
                {favoritos.includes(producto.id) && (
                  <div className="absolute top-2 left-2">
                    <Heart className="fill-red-500 text-red-500" size={20} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {producto.descripcion}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <MapPin size={16} />
                  <span>{producto.ubicacion}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-[hsl(var(--primary))]">
                      ${producto.precio}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      producto.disponibilidad
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {producto.disponibilidad ? "Disponible" : "No disponible"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewProduct(producto)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye size={18} />
                    Ver
                  </button>
                  <button
                    onClick={() => onEditProduct(producto)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteProduct(producto)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MisProductosPage;
