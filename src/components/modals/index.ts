/**
 * Modals Index - Exportación centralizada de todos los componentes modales
 *
 * Este archivo proporciona un único punto de importación para todos los modales
 * de la aplicación, facilitando su uso y mantenimiento.
 *
 * @example
 * // En lugar de múltiples imports:
 * import ProductModal from '@/components/modals/ProductModal';
 * import UserModal from '@/components/modals/UserModal';
 *
 * // Usa un solo import:
 * import { ProductModal, UserModal } from '@/components/modals';
 */

// Product Modals
export { default as ProductModal } from "./ProductModal";
export { default as ProductEditModal } from "./ProductEditModal";
export { default as ProductReportModal } from "./ProductReportModal";

// Incidence Modals
export { default as IncidenceModal } from "./IncidenceModal";
export { default as AppealModal } from "./AppealModal";

// User Modals
export { default as UserModal } from "./UserModal";

// Generic Modals
export { default as DeleteConfirmationModal } from "./DeleteConfirmationModal";
