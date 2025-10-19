import { X } from "lucide-react";
import { toast } from "sonner";
import PropTypes from "prop-types";

/**
 * FilterPanel - Panel lateral de filtros para productos
 *
 * @param {Object} props
 * @param {Object} props.filters - Objeto con estados y funciones de filtros
 * @param {Array} props.productos - Lista de productos para contar
 * @param {boolean} props.isVisible - Control de visibilidad del panel
 */
const FilterPanel = ({ filters, productos = [], isVisible = true }) => {
  const categorias = ["Electrónica", "Deportes", "Videojuegos"];
  const ubicaciones = ["Quito", "Guayaquil", "Cuenca", "Ambato"];

  const handleClearFilters = () => {
    filters.clearFilters();
    toast.success("Filtros restablecidos", {
      description: "Todos los filtros han sido limpiados",
      duration: 2000,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filtros</h3>
          <button
            onClick={handleClearFilters}
            className="text-sm text-brand hover:underline"
          >
            Limpiar
          </button>
        </div>

        <div className="space-y-6">
          {/* Categorías con múltiple selección */}
          <div>
            <label className="block text-sm font-medium mb-3">Categoría</label>
            <div className="space-y-2">
              {categorias.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.categoriasSeleccionadas?.includes(cat) || false
                    }
                    onChange={() => filters.toggleCategoria?.(cat)}
                    className="mr-2 w-4 h-4 text-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary))]"
                  />
                  <span className="text-sm capitalize group-hover:text-[hsl(var(--primary))] transition-colors">
                    {cat}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    ({productos.filter((p) => p.categoria === cat).length})
                  </span>
                </label>
              ))}
            </div>
            {filters.categoriasSeleccionadas?.length > 0 && (
              <button
                onClick={() => filters.setCategoriasSeleccionadas?.([])}
                className="text-xs text-[hsl(var(--primary))] hover:underline mt-2"
              >
                Limpiar selección
              </button>
            )}
          </div>

          {/* Rango de Precio con Slider Visual */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Rango de Precio
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.precioMin || 0}
                  onChange={(e) =>
                    filters.handlePriceChange?.(
                      Number(e.target.value),
                      filters.precioMax,
                    )
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={filters.precioMax || 0}
                  onChange={(e) =>
                    filters.handlePriceChange?.(
                      filters.precioMin,
                      Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                  placeholder="Max"
                />
              </div>

              {/* Slider con indicadores visuales */}
              <div className="relative pt-2">
                <input
                  type="range"
                  min="0"
                  max="1500"
                  value={filters.precioMax || 0}
                  onChange={(e) =>
                    filters.handlePriceChange?.(
                      filters.precioMin,
                      Number(e.target.value),
                    )
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((filters.precioMax || 0) / 1500) * 100}%, #e5e7eb ${((filters.precioMax || 0) / 1500) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${filters.precioMin || 0}</span>
                  <span className="font-semibold text-[hsl(var(--primary))]">
                    ${filters.precioMax || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle de Disponibilidad */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Disponibilidad
            </label>
            <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded transition-colors">
              <span className="text-sm font-medium">
                Solo productos disponibles
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.soloDisponibles || false}
                  onChange={(e) =>
                    filters.setSoloDisponibles?.(e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(var(--primary))]/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[hsl(var(--primary))]"></div>
              </div>
            </label>
          </div>

          {/* Filtro por Ubicación (Ciudades) */}
          <div>
            <label className="block text-sm font-medium mb-3">Ubicación</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ubicaciones.map((ubicacion) => (
                <label
                  key={ubicacion}
                  className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.ubicacionesSeleccionadas?.includes(ubicacion) ||
                      false
                    }
                    onChange={() => filters.toggleUbicacion?.(ubicacion)}
                    className="w-4 h-4 text-[hsl(var(--primary))] bg-gray-100 border-gray-300 rounded focus:ring-[hsl(var(--primary))] dark:focus:ring-[hsl(var(--primary))] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm">
                    {ubicacion}
                    <span className="ml-2 text-xs text-gray-500">
                      (
                      {
                        productos.filter((p) => p.ubicacion === ubicacion)
                          .length
                      }
                      )
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Botón para resetear filtros */}
          <div className="pt-4 border-t">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} />
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Validación completa de PropTypes para SonarQube
FilterPanel.propTypes = {
  filters: PropTypes.shape({
    // Estados
    categoriasSeleccionadas: PropTypes.array,
    precioMin: PropTypes.number,
    precioMax: PropTypes.number,
    soloDisponibles: PropTypes.bool,
    ubicacionesSeleccionadas: PropTypes.array,

    // Funciones
    clearFilters: PropTypes.func,
    toggleCategoria: PropTypes.func,
    setCategoriasSeleccionadas: PropTypes.func,
    handlePriceChange: PropTypes.func,
    setSoloDisponibles: PropTypes.func,
    toggleUbicacion: PropTypes.func,
  }).isRequired,

  productos: PropTypes.arrayOf(
    PropTypes.shape({
      categoria: PropTypes.string,
      ubicacion: PropTypes.string,
    }),
  ),

  isVisible: PropTypes.bool,
};

// Valores por defecto
FilterPanel.defaultProps = {
  filters: {
    categoriasSeleccionadas: [],
    precioMin: 0,
    precioMax: 0,
    soloDisponibles: false,
    ubicacionesSeleccionadas: [],
  },
  productos: [],
  isVisible: true,
};

export default FilterPanel;
