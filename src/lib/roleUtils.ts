/**
 * Utilidades para manejo de roles de usuario
 */

// Tipos de roles normalizados
export type UserRole = "ADMIN" | "VENDEDOR" | "COMPRADOR";

/**
 * Mapeo de roles variantes a roles normalizados
 */
const ROLE_VARIANTS: Record<string, UserRole> = {
  // Admin variants
  ADMIN: "ADMIN",
  ADMINISTRADOR: "ADMIN",
  ADMINISTRATOR: "ADMIN",
  
  // Vendedor variants
  VENDEDOR: "VENDEDOR",
  SELLER: "VENDEDOR",
  VENDOR: "VENDEDOR",
  
  // Comprador variants
  COMPRADOR: "COMPRADOR",
  BUYER: "COMPRADOR",
  CUSTOMER: "COMPRADOR",
  CLIENTE: "COMPRADOR",
};

/**
 * Normaliza el rol de usuario a uno de los tres tipos estándar
 * @param role - El rol del usuario (puede estar en diferentes formatos)
 * @returns El rol normalizado
 */
export const normalizeRole = (role: string | undefined | null): UserRole => {
  if (!role) return "COMPRADOR"; // Default role
  
  const normalizedRole = ROLE_VARIANTS[role.toUpperCase()];
  return normalizedRole || "COMPRADOR"; // Default to COMPRADOR if unknown
};

/**
 * Verifica si el usuario tiene permisos de administrador
 * @param role - El rol del usuario
 * @returns true si el usuario es admin
 */
export const isAdmin = (role: string | undefined | null): boolean => {
  return normalizeRole(role) === "ADMIN";
};

/**
 * Verifica si el usuario tiene permisos de vendedor o superior
 * @param role - El rol del usuario
 * @returns true si el usuario es vendedor o admin
 */
export const isVendor = (role: string | undefined | null): boolean => {
  const normalized = normalizeRole(role);
  return normalized === "VENDEDOR" || normalized === "ADMIN";
};

/**
 * Verifica si el usuario debe ver el sidebar
 * @param role - El rol del usuario
 * @returns true si el usuario debe ver el sidebar (VENDEDOR o ADMIN)
 */
export const shouldShowSidebar = (role: string | undefined | null): boolean => {
  const normalized = normalizeRole(role);
  return normalized === "ADMIN" || normalized === "VENDEDOR";
};

/**
 * Verifica si el usuario es solo comprador
 * @param role - El rol del usuario
 * @returns true si el usuario es comprador
 */
export const isCustomer = (role: string | undefined | null): boolean => {
  return normalizeRole(role) === "COMPRADOR";
};

/**
 * Obtiene un color de badge según el rol
 * @param role - El rol del usuario
 * @returns Clases de Tailwind para el badge del rol
 */
export const getRoleBadgeClasses = (role: string | undefined | null): string => {
  const normalized = normalizeRole(role);
  
  switch (normalized) {
    case "ADMIN":
      return "bg-red-500 text-white";
    case "VENDEDOR":
      return "bg-blue-500 text-white";
    case "COMPRADOR":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

/**
 * Obtiene el nombre displayable del rol
 * @param role - El rol del usuario
 * @returns Nombre del rol en español
 */
export const getRoleDisplayName = (role: string | undefined | null): string => {
  const normalized = normalizeRole(role);
  
  switch (normalized) {
    case "ADMIN":
      return "Administrador";
    case "VENDEDOR":
      return "Vendedor";
    case "COMPRADOR":
      return "Comprador";
    default:
      return "Usuario";
  }
};
