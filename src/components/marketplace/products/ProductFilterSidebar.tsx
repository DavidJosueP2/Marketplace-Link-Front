import { X, ChevronDown, DollarSign, MapPin } from "lucide-react";

const CATEGORIAS = ["Electrónica", "Deportes", "Videojuegos", "Moda", "Hogar"];
const UBICACIONES = ["Quito", "Guayaquil", "Cuenca", "Ambato"];

const ProductFilterSidebar = ({
  isOpen,
  onClose,
  precioMin,
  setPrecioMin,
  precioMax,
  setPrecioMax,
  categoriasSeleccionadas,
  setCategoriasSeleccionadas,
  soloDisponibles,
  setSoloDisponibles,
  ubicacionesSeleccionadas,
  setUbicacionesSeleccionadas,
  onApply,
}) => {
  const toggleCategoria = (categoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria],
    );
  };

  const toggleUbicacion = (ubicacion) => {
    setUbicacionesSeleccionadas((prev) =>
      prev.includes(ubicacion)
        ? prev.filter((u) => u !== ubicacion)
        : [...prev, ubicacion],
    );
  };

  const resetFilters = () => {
    setPrecioMin(0);
    setPrecioMax(1500);
    setCategoriasSeleccionadas([]);
    setSoloDisponibles(true);
    setUbicacionesSeleccionadas([]);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtros
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Rango de Precio
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Mínimo: ${precioMin}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Máximo: ${precioMax}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Categorías
            </h3>
            <div className="space-y-2">
              {CATEGORIAS.map((categoria) => (
                <label
                  key={categoria}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={categoriasSeleccionadas.includes(categoria)}
                    onChange={() => toggleCategoria(categoria)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {categoria}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Ubicación
              </h3>
            </div>
            <div className="space-y-2">
              {UBICACIONES.map((ubicacion) => (
                <label
                  key={ubicacion}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={ubicacionesSeleccionadas.includes(ubicacion)}
                    onChange={() => toggleUbicacion(ubicacion)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {ubicacion}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                checked={soloDisponibles}
                onChange={(e) => setSoloDisponibles(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-400"
              />
              <span className="font-medium text-gray-900 dark:text-white">
                Solo productos disponibles
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={onApply}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Aplicar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProductFilterSidebar;
