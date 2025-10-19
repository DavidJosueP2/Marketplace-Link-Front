import { useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  MapPin,
  Package,
  Shield,
  Truck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCardWithShadowClasses,
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getBorderClasses,
  getButtonClasses,
  getBadgeClasses,
} from "@/lib/themeHelpers";

/**
 * ProductDetailPage - Página de detalle de producto estilo Amazon
 */
const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    productos = [],
    favoritos = [],
    toggleFavorite,
    getEstadoColor,
    theme = "light",
  } = useOutletContext<{
    productos: any[];
    favoritos: number[];
    toggleFavorite: (id: number) => void;
    getEstadoColor: (estado: string) => string;
    theme: "light" | "dark";
  }>();

  const [cantidad, setCantidad] = useState(1);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

  // Buscar el producto por ID
  const producto = productos.find((p) => p.id === Number.parseInt(id || "0", 10));

  // Obtener clases del tema
  const cardClasses = getCardWithShadowClasses(theme);
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const borderClass = getBorderClasses(theme);
  const buttonPrimary = getButtonClasses("primary", theme);
  const buttonSecondary = getButtonClasses("secondary", theme);

  if (!producto) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package size={64} className="text-gray-300 mb-4" />
        <h2 className={`${textPrimary} text-2xl font-bold mb-2`}>
          Producto no encontrado
        </h2>
        <p className={`${textSecondary} mb-6`}>
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <button
          onClick={() => navigate("/marketplace-refactored/productos")}
          className={buttonPrimary}
        >
          <ArrowLeft size={20} />
          Volver al catálogo
        </button>
      </div>
    );
  }

  const isFavorite = favoritos.includes(producto.id);

  // Simular múltiples imágenes (en producción vendrían del backend)
  const imagenesProducto = [
    { id: `${producto.id}-img-1`, emoji: producto.imagen },
    { id: `${producto.id}-img-2`, emoji: producto.imagen },
    { id: `${producto.id}-img-3`, emoji: producto.imagen },
    { id: `${producto.id}-img-4`, emoji: producto.imagen },
  ];

  const handleComprar = () => {
    toast.success(
      `¡Producto "${producto.nombre}" agregado al carrito! Cantidad: ${cantidad}`,
    );
  };

  const handleAgregarCarrito = () => {
    toast.info(`${cantidad} unidad(es) de "${producto.nombre}" en el carrito`);
  };

  const handleCompartir = () => {
    navigator.clipboard.writeText(globalThis.location.href);
    toast.success("¡Link copiado al portapapeles!");
  };

  // Calcular calificación promedio (simulada)
  const rating = 4.3;
  const totalReviews = 1326;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb y navegación */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate("/marketplace-refactored/productos")}
          className={`${textSecondary} hover:text-[#FF9900] transition-colors flex items-center gap-1`}
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </button>
        <span className={textSecondary}>/</span>
        <span className={textSecondary}>{producto.categoria}</span>
        <span className={textSecondary}>/</span>
        <span className={textPrimary}>{producto.nombre}</span>
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda - Imágenes */}
        <div className="lg:col-span-5">
          <div className={cardClasses}>
            {/* Imagen principal */}
            <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg overflow-hidden flex items-center justify-center mb-4">
              <span className="text-[200px] transform hover:scale-110 transition-transform duration-300">
                {imagenesProducto[imagenSeleccionada].emoji}
              </span>
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <span className={getEstadoColor(producto.estado)}>
                  {producto.estado}
                </span>
                {producto.disponibilidad && (
                  <span className={getBadgeClasses("success")}>
                    Disponible
                  </span>
                )}
              </div>

              {/* Botón favorito */}
              <button
                onClick={() => toggleFavorite(producto.id)}
                className="absolute top-4 left-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-transform"
              >
                <Heart
                  size={24}
                  className={
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-2">
              {imagenesProducto.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setImagenSeleccionada(index)}
                  className={`aspect-square rounded-lg border-2 transition-all ${
                    imagenSeleccionada === index
                      ? "border-[#FF9900]"
                      : `border-transparent ${borderClass}`
                  } bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center hover:border-[#FF9900]`}
                >
                  <span className="text-4xl">{img.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Central - Información del Producto */}
        <div className="lg:col-span-4 space-y-4">
          <div className={cardClasses}>
            {/* Título y marca */}
            <div className="mb-4">
              <p className={`${textSecondary} text-sm mb-1`}>
                Marca: <span className="text-[#146EB4]">{producto.vendedor}</span>
              </p>
              <h1 className={`${textPrimary} text-2xl lg:text-3xl font-bold mb-2`}>
                {producto.nombre}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="fill-[#FF9900] text-[#FF9900]" size={20} />
                <span className={`${textPrimary} font-semibold`}>{rating}</span>
              </div>
              <button className="text-[#146EB4] hover:underline text-sm">
                {totalReviews.toLocaleString()} calificaciones
              </button>
            </div>

            {/* Precio */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm text-red-600 dark:text-red-400">
                  -23%
                </span>
                <span className={`${textPrimary} text-4xl font-bold`}>
                  US$
                </span>
                <span className={`${textPrimary} text-5xl font-bold`}>
                  {producto.precio}
                </span>
                <span className={`${textPrimary} text-2xl`}>99</span>
              </div>
              <p className={`${textSecondary} text-sm`}>
                Precio recomendado:{" "}
                <span className="line-through">US${(producto.precio * 1.3).toFixed(2)}</span>
              </p>
              <p className={`${textSecondary} text-sm mt-1`}>
                + US$30.49 de cargos de envío e importación a Ecuador
              </p>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h2 className={`${textPrimary} text-lg font-semibold mb-3`}>
                Acerca de este artículo
              </h2>
              <p className={`${textSecondary} leading-relaxed mb-4`}>
                {producto.descripcion}
              </p>

              {/* Características */}
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Package size={20} className="text-[#FF9900] flex-shrink-0 mt-0.5" />
                  <span className={textSecondary}>
                    Categoría: <span className={textPrimary}>{producto.categoria}</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={20} className="text-[#FF9900] flex-shrink-0 mt-0.5" />
                  <span className={textSecondary}>
                    Ubicación: <span className={textPrimary}>{producto.ubicacion}</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield size={20} className="text-[#FF9900] flex-shrink-0 mt-0.5" />
                  <span className={textSecondary}>
                    Stock disponible: <span className={textPrimary}>{producto.stock || 15} unidades</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Beneficios */}
            <div className="space-y-3 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Truck className="text-[#067D62]" size={24} />
                <div>
                  <p className={`${textPrimary} font-medium`}>Envío rápido</p>
                  <p className={`${textSecondary} text-sm`}>
                    Llega en 3-5 días hábiles
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-[#0066C0]" size={24} />
                <div>
                  <p className={`${textPrimary} font-medium`}>Compra protegida</p>
                  <p className={`${textSecondary} text-sm`}>
                    Garantía de devolución de 30 días
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Compra */}
        <div className="lg:col-span-3">
          <div className={`${cardClasses} sticky top-4`}>
            {/* Precio destacado */}
            <div className="mb-4">
              <p className={`${textPrimary} text-3xl font-bold mb-1`}>
                US${producto.precio}.99
              </p>
              <p className={`${textSecondary} text-sm`}>
                + US$30.49 Envío e importación a Ecuador
              </p>
            </div>

            {/* Disponibilidad */}
            <div className="mb-4 flex items-center gap-2">
              {producto.disponibilidad ? (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Disponible
                  </span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Agotado
                  </span>
                </>
              )}
            </div>

            {/* Entrega */}
            <div className={`mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border ${borderClass}`}>
              <div className="flex items-start gap-2 mb-2">
                <Clock size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`${textPrimary} font-medium text-sm`}>
                    Entrega: jueves, 13 de noviembre
                  </p>
                  <p className={`${textSecondary} text-xs mt-1`}>
                    a Ecuador
                  </p>
                </div>
              </div>
              <button className="text-[#146EB4] hover:underline text-sm">
                Enviar a Ecuador
              </button>
            </div>

            {/* Selector de cantidad */}
            <div className="mb-4">
              <label htmlFor="cantidad-select" className={`${textPrimary} text-sm font-medium mb-2 block`}>
                Cantidad:
              </label>
              <select
                id="cantidad-select"
                value={cantidad}
                onChange={(e) => setCantidad(Number.parseInt(e.target.value, 10))}
                className={`w-full px-3 py-2 rounded-lg border ${borderClass} ${theme === "dark" ? "bg-gray-800" : "bg-white"} ${textPrimary}`}
                disabled={!producto.disponibilidad}
              >
                {Array.from({ length: Math.min(producto.stock || 10, 10) }, (_, i) => (
                  <option key={`cantidad-${i + 1}`} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={handleAgregarCarrito}
                disabled={!producto.disponibilidad}
                className={`w-full ${buttonSecondary} flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingCart size={20} />
                Agregar al Carrito
              </button>

              <button
                onClick={handleComprar}
                disabled={!producto.disponibilidad}
                className={`w-full ${buttonPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Comprar ahora
              </button>

              <button
                onClick={handleCompartir}
                className={`w-full ${buttonSecondary} flex items-center justify-center gap-2`}
              >
                <Share2 size={18} />
                Compartir
              </button>
            </div>

            {/* Información adicional */}
            <div className={`mt-6 pt-6 border-t ${borderClass} space-y-2 text-sm`}>
              <div className="flex items-start gap-2">
                <Package size={16} className={`${textSecondary} flex-shrink-0 mt-0.5`} />
                <p className={textSecondary}>
                  <span className={textPrimary}>Vendido por:</span> {producto.vendedor}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Shield size={16} className={`${textSecondary} flex-shrink-0 mt-0.5`} />
                <p className={textSecondary}>Transacción segura</p>
              </div>
              <div className="flex items-start gap-2">
                <Truck size={16} className={`${textSecondary} flex-shrink-0 mt-0.5`} />
                <p className={textSecondary}>
                  Devoluciones: 30 días / reemplazo
                </p>
              </div>
            </div>

            {/* Alerta de stock bajo */}
            {producto.stock && producto.stock < 5 && producto.disponibilidad && (
              <div className={`mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-start gap-2`}>
                <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  ¡Solo quedan {producto.stock} unidades en stock!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Detalles Técnicos */}
      <div className={cardClasses}>
        <h2 className={`${textPrimary} text-2xl font-bold mb-6`}>
          Detalles del producto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`${textPrimary} font-semibold mb-3`}>
              Información General
            </h3>
            <dl className="space-y-2">
              <div className="flex">
                <dt className={`${textSecondary} w-40`}>Marca:</dt>
                <dd className={textPrimary}>{producto.vendedor}</dd>
              </div>
              <div className="flex">
                <dt className={`${textSecondary} w-40`}>Categoría:</dt>
                <dd className={textPrimary}>{producto.categoria}</dd>
              </div>
              <div className="flex">
                <dt className={`${textSecondary} w-40`}>Estado:</dt>
                <dd className={textPrimary}>{producto.estado}</dd>
              </div>
              <div className="flex">
                <dt className={`${textSecondary} w-40`}>SKU:</dt>
                <dd className={textPrimary}>PRD-{producto.id.toString().padStart(6, "0")}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className={`${textPrimary} font-semibold mb-3`}>
              Envío y Devoluciones
            </h3>
            <dl className="space-y-2">
              <div className="flex">
                <dt className={`${textSecondary} w-40`}>Ubicación:</dt>
                <dd className={textPrimary}>{producto.ubicacion}</dd>
              </div>
              <div className="flex">
                <dt className={`${textSecondary} w-40`}>Tiempo de envío:</dt>
                <dd className={textPrimary}>3-5 días hábiles</dd>
              </div>
              <div className="flex">
                <dt className={`${textSecondary} w-40`}>Garantía:</dt>
                <dd className={textPrimary}>30 días de devolución</dd>
              </div>
              <div className="flex">
                <dt className={`${textSecondary} w-40`}>Pagos:</dt>
                <dd className={textPrimary}>Transacción segura</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Productos Relacionados (placeholder) */}
      <div className={cardClasses}>
        <h2 className={`${textPrimary} text-2xl font-bold mb-6`}>
          Productos relacionados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productos
            .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
            .slice(0, 4)
            .map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/marketplace-refactored/producto/${p.id}`)}
                className={`${cardClasses} hover:shadow-xl transition-all group text-left`}
              >
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-6xl group-hover:scale-110 transition-transform">
                    {p.imagen}
                  </span>
                </div>
                <h3 className={`${textPrimary} font-medium text-sm mb-2 line-clamp-2`}>
                  {p.nombre}
                </h3>
                <p className={`${textPrimary} font-bold text-lg`}>
                  US${p.precio}.99
                </p>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
