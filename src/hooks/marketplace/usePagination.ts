import { useMemo } from "react";

/**
 * Custom hook para manejar la paginación de cualquier lista de items
 * @param {Array} items - Array de items a paginar
 * @param {number} currentPage - Página actual
 * @param {number} itemsPerPage - Items por página
 * @returns {Object} Objeto con items paginados y metadata
 */
export const usePagination = (items, currentPage, itemsPerPage) => {
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      totalPages,
      totalItems: items.length,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, items.length),
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      isEmpty: items.length === 0,
    };
  }, [items, currentPage, itemsPerPage]);

  return paginationData;
};

/**
 * Hook para generar números de página con ellipsis
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 * @param {number} maxVisible - Máximo de páginas visibles
 * @returns {Array} Array con números de página y ellipsis
 */
export const usePageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  const pageNumbers = useMemo(() => {
    const pages = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxVisible]);

  return pageNumbers;
};
