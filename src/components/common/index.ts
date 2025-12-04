/**
 * Common Components - Exportación centralizada
 *
 * Este archivo proporciona un único punto de importación para todos los componentes
 * comunes reutilizables de la aplicación.
 */

// Legacy exports (deprecated)
export { default as ProductCard } from "./ProductCard";
export { default as FilterPanel } from "./FilterPanel";

// Current exports
export { default as Pagination } from "./Pagination";
export {
  PublicationSkeleton,
  ProductoSkeleton,
  IncidenceSkeleton,
  IncidenciaSkeleton,
  StatCardSkeleton,
} from "./Skeletons";

// Publications
export * from "./publications";
