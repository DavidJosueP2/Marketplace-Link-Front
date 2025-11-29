import { useMemo } from "react";

/**
 * Custom hook para manejar el filtrado de productos
 * Aplica filtros de precio, categoría, disponibilidad y ubicación
 */
export const useProductFilters = (productos, filters) => {
  const {
    precioMin,
    precioMax,
    categoriasSeleccionadas,
    soloDisponibles,
    ubicacionesSeleccionadas,
  } = filters;

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      // Filtro por categorías múltiples
      const categoriaMatch =
        categoriasSeleccionadas.length === 0 ||
        categoriasSeleccionadas.includes(p.categoria);

      // Filtro por precio
      const precioMatch = p.precio >= precioMin && p.precio <= precioMax;

      // Filtro por disponibilidad
      const disponibilidadMatch = !soloDisponibles || p.disponibilidad;

      // Filtro por ubicación
      const ubicacionMatch =
        ubicacionesSeleccionadas.length === 0 ||
        ubicacionesSeleccionadas.includes(p.ubicacion);

      return (
        categoriaMatch && precioMatch && disponibilidadMatch && ubicacionMatch
      );
    });
  }, [
    productos,
    precioMin,
    precioMax,
    categoriasSeleccionadas,
    soloDisponibles,
    ubicacionesSeleccionadas,
  ]);

  return productosFiltrados;
};

/**
 * Custom hook para manejar el filtrado de incidencias
 */
export const useIncidenciaFilters = (incidencias, filtroEstadoIncidencia) => {
  const incidenciasFiltradas = useMemo(() => {
    return incidencias.filter(
      (i) =>
        filtroEstadoIncidencia === "todas" ||
        i.estado === filtroEstadoIncidencia,
    );
  }, [incidencias, filtroEstadoIncidencia]);

  return incidenciasFiltradas;
};

/**
 * Custom hook para manejar el filtrado de usuarios
 */
export const useUsuarioFilters = (
  usuarios,
  filtroRolUsuario,
  filtroEstadoUsuario,
  searchUsuario,
) => {
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const rolMatch =
        filtroRolUsuario === "todos" || u.rol === filtroRolUsuario;
      const estadoMatch =
        filtroEstadoUsuario === "todos" || u.estado === filtroEstadoUsuario;
      const searchMatch =
        !searchUsuario ||
        u.nombre.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        u.apellido.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        u.cedula.includes(searchUsuario);

      return rolMatch && estadoMatch && searchMatch;
    });
  }, [usuarios, filtroRolUsuario, filtroEstadoUsuario, searchUsuario]);

  return usuariosFiltrados;
};
