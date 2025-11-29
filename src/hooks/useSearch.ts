import { useState, useCallback, useMemo } from "react";

/**
 * Custom hook para gestionar la lógica de búsqueda
 * Centraliza: búsqueda, filtros, estado de búsqueda
 */
export const useSearch = (productos = []) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Mock search results - En producción llamaría a una API
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return productos
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(query) ||
          p.descripcion.toLowerCase().includes(query) ||
          p.categoria.toLowerCase().includes(query),
      )
      .slice(0, 5);
  }, [searchQuery, productos]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  }, []);

  const handleSearchSubmit = useCallback((value) => {
    setSearchQuery(value);
    setShowSearchResults(true);
  }, []);

  const handleSearchSelect = useCallback((product) => {
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchFocused(false);
    // En producción: navegar a página del producto
    return product;
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchFocused(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    searchFocused,
    setSearchFocused,
    showSearchResults,
    setShowSearchResults,
    searchResults,
    handleSearchSubmit,
    handleSearchSelect,
    clearSearch,
  };
};
