import { useState, useCallback } from "react";

/**
 * Custom hook para gestionar incidencias con filtros y paginación
 * Centraliza: filtros de estado, paginación, búsqueda
 */
export const useIncidenceFilters = () => {
  const [filtroEstadoIncidencia, setFiltroEstadoIncidencia] = useState("todas");
  const [currentPageIncidencias, setCurrentPageIncidencias] = useState(1);
  const [itemsPerPageIncidencias, setItemsPerPageIncidencias] = useState(10);
  const [isLoadingIncidencias, setIsLoadingIncidencias] = useState(true);

  const resetPagination = useCallback(() => {
    setCurrentPageIncidencias(1);
  }, []);

  const changePage = useCallback((page) => {
    setCurrentPageIncidencias(page);
  }, []);

  return {
    filtroEstadoIncidencia,
    setFiltroEstadoIncidencia,
    currentPageIncidencias,
    setCurrentPageIncidencias,
    itemsPerPageIncidencias,
    setItemsPerPageIncidencias,
    isLoadingIncidencias,
    setIsLoadingIncidencias,
    resetPagination,
    changePage,
  };
};
