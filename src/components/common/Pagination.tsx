import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  getCardWithShadowClasses,
  getTextSecondaryClasses,
  getBorderClasses,
} from "@/lib/themeHelpers";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  theme?: "light" | "dark";
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  theme = "light",
}: PaginationProps) => {
  const cardClasses = getCardWithShadowClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const borderClass = getBorderClasses(theme);
  const getPageNumbers = (): (number | string)[] => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className={`mt-8 flex flex-col lg:flex-row items-center justify-between gap-4 ${cardClasses} p-4 rounded-lg`}>
      {/* Items per page selector */}
      <div className="flex items-center gap-2 w-full lg:w-auto justify-center lg:justify-start">
        <span className={`text-sm ${textSecondary} whitespace-nowrap`}>
          Mostrar
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className={`px-3 py-1 border ${borderClass} rounded ${theme === "dark" ? "bg-gray-700" : "bg-white"} text-sm focus:ring-2 focus:ring-[#FF9900] focus:outline-none`}
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
        <span className={`text-sm ${textSecondary} whitespace-nowrap`}>
          por página
        </span>
      </div>

      {/* Page info */}
      <div className={`text-sm ${textSecondary} text-center lg:text-left`}>
        Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {/* First page - Hidden on mobile */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} disabled:opacity-50 disabled:cursor-not-allowed transition-colors hidden sm:block`}
          title="Primera página"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          title="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page numbers */}
        <div className="flex gap-1">
          {getPageNumbers().map((page) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${currentPage}-${totalPages}`}
                  className={`px-2 sm:px-3 py-1 ${textSecondary}`}
                >
                  ...
                </span>
              );
            }

            const hoverClass =
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

            return (
              <button
                type="button"
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={`min-w-[2rem] sm:min-w-[2.5rem] px-2 sm:px-3 py-1 rounded transition-colors text-sm sm:text-base ${
                  currentPage === page
                    ? "bg-[#FF9900] hover:bg-[#FFB84D] text-white font-semibold"
                    : hoverClass
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          title="Página siguiente"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last page - Hidden on mobile */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} disabled:opacity-50 disabled:cursor-not-allowed transition-colors hidden sm:block`}
          title="Última página"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
