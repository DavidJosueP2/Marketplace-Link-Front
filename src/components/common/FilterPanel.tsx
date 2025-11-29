import { X } from "lucide-react";
import { toast } from "sonner";
import {
  getCardWithShadowClasses,
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getBorderClasses,
} from "@/lib/themeHelpers";

interface Producto {
  categoria?: string;
  ubicacion?: string;
}

interface FilterPanelProps {
  filters: {
    categoriasSeleccionadas?: string[];
    precioMin?: number;
    precioMax?: number;
    soloDisponibles?: boolean;
    ubicacionesSeleccionadas?: string[];
    clearFilters?: () => void;
    toggleCategoria?: (cat: string) => void;
    setCategoriasSeleccionadas?: (cats: string[]) => void;
    handlePriceChange?: (min: number, max: number) => void;
    setSoloDisponibles?: (value: boolean) => void;
    toggleUbicacion?: (ubicacion: string) => void;
  };
  productos?: Producto[];
  isVisible?: boolean;
  theme?: "light" | "dark";
}

const FilterPanel = ({
  filters,
  productos = [],
  isVisible = true,
  theme = "light",
}: FilterPanelProps) => {
  const cardClasses = getCardWithShadowClasses(theme);
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const borderClass = getBorderClasses(theme);
  const categorias = ["Electrónica", "Deportes", "Videojuegos"];
  const ubicaciones = ["Quito", "Guayaquil", "Cuenca", "Ambato"];

  const handleClearFilters = () => {
    if (filters.clearFilters) {
      filters.clearFilters();
      toast.success("Filtros restablecidos", {
        description: "Todos los filtros han sido limpiados",
        duration: 2000,
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className={`${cardClasses} rounded-lg p-4 lg:p-6 lg:sticky lg:top-24`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-lg ${textPrimary}`}>Filtros</h3>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-[#FF9900] hover:text-[#FFB84D] font-medium transition-colors"
          >
            Limpiar
          </button>
        </div>

        <div className="space-y-6">
          {/* Categorías con múltiple selección */}
          <div>
            <div className={`block text-sm font-medium mb-3 ${textPrimary}`}>
              Categoría
            </div>
            <div className="space-y-2">
              {categorias.map((cat) => (
                <label
                  key={cat}
                  className={`flex items-center cursor-pointer group p-2 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.categoriasSeleccionadas?.includes(cat) || false
                    }
                    onChange={() => filters.toggleCategoria?.(cat)}
                    className="mr-2 w-4 h-4 text-[#FF9900] focus:ring-2 focus:ring-[#FF9900] rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className={`text-sm capitalize ${textPrimary} group-hover:text-[#FF9900] transition-colors`}>
                    {cat}
                  </span>
                  <span className={`ml-auto text-xs ${textSecondary}`}>
                    ({productos.filter((p) => p.categoria === cat).length})
                  </span>
                </label>
              ))}
            </div>
            {(filters.categoriasSeleccionadas?.length ?? 0) > 0 && (
              <button
                type="button"
                onClick={() => filters.setCategoriasSeleccionadas?.([])}
                className="text-xs text-[#FF9900] hover:text-[#FFB84D] font-medium mt-2 transition-colors"
              >
                Limpiar selección
              </button>
            )}
          </div>

          {/* Rango de Precio con Slider Visual */}
          <div>
            <div className={`block text-sm font-medium mb-3 ${textPrimary}`}>
              Rango de Precio
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.precioMin || 0}
                  onChange={(e) =>
                    filters.handlePriceChange?.(
                      Number(e.target.value),
                      filters.precioMax ?? 0,
                    )
                  }
                  className={`w-full px-3 py-2 border ${borderClass} rounded ${theme === "dark" ? "bg-gray-700" : "bg-white"} text-sm focus:ring-2 focus:ring-[#FF9900] focus:outline-none`}
                  placeholder="Min"
                />
                <span className={textSecondary}>-</span>
                <input
                  type="number"
                  value={filters.precioMax || 0}
                  onChange={(e) =>
                    filters.handlePriceChange?.(
                      filters.precioMin ?? 0,
                      Number(e.target.value),
                    )
                  }
                  className={`w-full px-3 py-2 border ${borderClass} rounded ${theme === "dark" ? "bg-gray-700" : "bg-white"} text-sm focus:ring-2 focus:ring-[#FF9900] focus:outline-none`}
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
                      filters.precioMin ?? 0,
                      Number(e.target.value),
                    )
                  }
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                  style={{
                    background: `linear-gradient(to right, #FF9900 0%, #FF9900 ${((filters.precioMax || 0) / 1500) * 100}%, ${theme === "dark" ? "#374151" : "#e5e7eb"} ${((filters.precioMax || 0) / 1500) * 100}%, ${theme === "dark" ? "#374151" : "#e5e7eb"} 100%)`,
                  }}
                />
                <div className={`flex justify-between text-xs ${textSecondary} mt-1`}>
                  <span>${filters.precioMin || 0}</span>
                  <span className="font-semibold text-[#FF9900]">
                    ${filters.precioMax || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle de Disponibilidad */}
          <div>
            <div className={`block text-sm font-medium mb-3 ${textPrimary}`}>
              Disponibilidad
            </div>
            <label className={`flex items-center justify-between cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"} p-3 rounded transition-colors`}>
              <span className={`text-sm font-medium ${textPrimary}`}>
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
                <div className={`w-11 h-6 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF9900]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF9900]`}></div>
              </div>
            </label>
          </div>

          {/* Filtro por Ubicación (Ciudades) */}
          <div>
            <div className={`block text-sm font-medium mb-3 ${textPrimary}`}>
              Ubicación
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ubicaciones.map((ubicacion) => (
                <label
                  key={ubicacion}
                  className={`flex items-center cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"} p-2 rounded transition-colors`}
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.ubicacionesSeleccionadas?.includes(ubicacion) ||
                      false
                    }
                    onChange={() => filters.toggleUbicacion?.(ubicacion)}
                    className={`w-4 h-4 text-[#FF9900] ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} border-gray-300 dark:border-gray-600 rounded focus:ring-[#FF9900] focus:ring-2`}
                  />
                  <span className={`ml-2 text-sm ${textPrimary}`}>
                    {ubicacion}
                    <span className={`ml-2 text-xs ${textSecondary}`}>
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
          <div className={`pt-4 border-t ${borderClass}`}>
            <button
              type="button"
              onClick={handleClearFilters}
              className={`w-full px-4 py-2 text-sm border ${borderClass} rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors flex items-center justify-center gap-2`}
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

export default FilterPanel;
