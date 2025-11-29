import { X } from "lucide-react";
import { toast } from "sonner";
import { useCategories } from "@/hooks/use-categories";
import {
  getCardWithShadowClasses,
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getBorderClasses,
} from "@/lib/themeHelpers";

interface PublicationFilters {
  selectedCategoryIds: number[];
  minPrice: number;
  maxPrice: number;
  selectedDistance: number | null;
  setSelectedCategoryIds: (ids: number[]) => void;
  setPriceRange: (min: number, max: number) => void;
  setSelectedDistance: (distance: number | null) => void;
  clearFilters: () => void;
}

interface FilterPanelProps {
  filters: PublicationFilters;
  isVisible?: boolean;
  theme?: "light" | "dark";
}

const DISTANCE_OPTIONS = [
  { value: 1, label: "1 km" },
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
];

const FilterPanel = ({
  filters,
  isVisible = true,
  theme = "light",
}: FilterPanelProps) => {
  const cardClasses = getCardWithShadowClasses(theme);
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const borderClass = getBorderClasses(theme);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const handleClearFilters = () => {
    if (filters.clearFilters) {
      filters.clearFilters();
      toast.success("Filtros restablecidos", {
        description: "Todos los filtros han sido limpiados",
        duration: 2000,
      });
    }
  };

  const toggleCategory = (categoryId: number) => {
    const newSelection = filters.selectedCategoryIds.includes(categoryId)
      ? filters.selectedCategoryIds.filter((id) => id !== categoryId)
      : [...filters.selectedCategoryIds, categoryId];
    filters.setSelectedCategoryIds(newSelection);
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
          {/* Categories Filter */}
          <div>
            <div className={`block text-sm font-medium mb-3 ${textPrimary}`}>
              Categorías
            </div>
            {categoriesLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={`flex items-center cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"} p-2 rounded transition-colors`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedCategoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-4 h-4 text-[#FF9900] bg-gray-100 border-gray-300 rounded focus:ring-[#FF9900] focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className={`ml-2 text-sm ${textPrimary}`}>
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
            {filters.selectedCategoryIds.length > 0 && (
              <button
                type="button"
                onClick={() => filters.setSelectedCategoryIds([])}
                className="text-xs text-[#FF9900] hover:text-[#FFB84D] font-medium mt-2 transition-colors"
              >
                Limpiar selección
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          <div>
            <div className={`block text-sm font-medium mb-3 ${textPrimary}`}>
              Rango de Precio
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`text-xs ${textSecondary} mb-1 block`}>
                    Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) =>
                      filters.setPriceRange(
                        Number(e.target.value),
                        filters.maxPrice
                      )
                    }
                    className={`w-full px-2 py-1 text-sm border ${borderClass} rounded ${theme === "dark" ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#FF9900] focus:outline-none`}
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className={`text-xs ${textSecondary} mb-1 block`}>
                    Máximo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      filters.setPriceRange(
                        filters.minPrice,
                        Number(e.target.value)
                      )
                    }
                    className={`w-full px-2 py-1 text-sm border ${borderClass} rounded ${theme === "dark" ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#FF9900] focus:outline-none`}
                    placeholder="$1000"
                  />
                </div>
              </div>
              <div className={`text-xs ${textSecondary} text-center`}>
                ${filters.minPrice} - ${filters.maxPrice}
              </div>
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <div className={`block text-sm font-medium mb-3 ${textPrimary}`}>
              Distancia a la redonda
            </div>
            <div className="space-y-2">
              {/* Opción para sin filtro de distancia */}
              <label
                className={`flex items-center cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"} p-2 rounded transition-colors`}
              >
                <input
                  type="radio"
                  name="distance"
                  checked={filters.selectedDistance === null}
                  onChange={() => filters.setSelectedDistance(null)}
                  className="w-4 h-4 text-[#FF9900] bg-gray-100 border-gray-300 focus:ring-[#FF9900] focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className={`ml-2 text-sm ${textPrimary} font-medium`}>
                  Todas las distancias
                </span>
              </label>
              
              {DISTANCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"} p-2 rounded transition-colors`}
                >
                  <input
                    type="radio"
                    name="distance"
                    checked={filters.selectedDistance === option.value}
                    onChange={() => filters.setSelectedDistance(option.value)}
                    className="w-4 h-4 text-[#FF9900] bg-gray-100 border-gray-300 focus:ring-[#FF9900] focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className={`ml-2 text-sm ${textPrimary}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
