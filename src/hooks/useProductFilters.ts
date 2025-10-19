import { useState, useCallback } from "react";

/**
 * Custom hook para gestionar filtros y búsqueda de productos
 * Centraliza: filtros de precio, categorías, ubicaciones, disponibilidad
 */
export const useProductFilters = () => {
  const [filtroPrecio, setFiltroPrecio] = useState("todos");
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(1500);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [soloDisponibles, setSoloDisponibles] = useState(true);
  const [ubicacionesSeleccionadas, setUbicacionesSeleccionadas] = useState([]);
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [itemsPerPageProducts, setItemsPerPageProducts] = useState(9);

  const handlePriceChange = useCallback((min, max) => {
    setPrecioMin(min);
    setPrecioMax(max);
    setCurrentPageProducts(1); // Reset pagination
  }, []);

  const toggleCategoria = useCallback((categoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria],
    );
    setCurrentPageProducts(1);
  }, []);

  const toggleUbicacion = useCallback((ubicacion) => {
    setUbicacionesSeleccionadas((prev) =>
      prev.includes(ubicacion)
        ? prev.filter((u) => u !== ubicacion)
        : [...prev, ubicacion],
    );
    setCurrentPageProducts(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltroPrecio("todos");
    setPrecioMin(0);
    setPrecioMax(1500);
    setCategoriasSeleccionadas([]);
    setSoloDisponibles(true);
    setUbicacionesSeleccionadas([]);
    setCurrentPageProducts(1);
  }, []);

  return {
    filtroPrecio,
    setFiltroPrecio,
    precioMin,
    precioMax,
    handlePriceChange,
    categoriasSeleccionadas,
    toggleCategoria,
    soloDisponibles,
    setSoloDisponibles,
    ubicacionesSeleccionadas,
    toggleUbicacion,
    currentPageProducts,
    setCurrentPageProducts,
    itemsPerPageProducts,
    setItemsPerPageProducts,
    clearFilters,
  };
};
