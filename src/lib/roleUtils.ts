/**
 * Utilidades para manejo de roles de usuario
 */

// Tipos de roles normalizados según el backend
export type UserRole = "ROLE_ADMIN" | "ROLE_MODERATOR" | "ROLE_SELLER" | "ROLE_BUYER" | "ROLE_SYSTEM";

/**
 * Mapeo de roles variantes a roles normalizados
 */
const ROLE_VARIANTS: Record<string, UserRole> = {
  // Admin variants
  ROLE_ADMIN: "ROLE_ADMIN",
  ADMIN: "ROLE_ADMIN",
  ADMINISTRADOR: "ROLE_ADMIN",
  ADMINISTRATOR: "ROLE_ADMIN",
  
  // Moderator variants
  ROLE_MODERATOR: "ROLE_MODERATOR",
  MODERATOR: "ROLE_MODERATOR",
  MODERADOR: "ROLE_MODERATOR",
  
  // Seller variants
  ROLE_SELLER: "ROLE_SELLER",
  SELLER: "ROLE_SELLER",
  VENDEDOR: "ROLE_SELLER",
  VENDOR: "ROLE_SELLER",
  
  // Buyer variants
  ROLE_BUYER: "ROLE_BUYER",
  BUYER: "ROLE_BUYER",
  COMPRADOR: "ROLE_BUYER",
  CUSTOMER: "ROLE_BUYER",
  CLIENTE: "ROLE_BUYER",
  
  // System variants
  ROLE_SYSTEM: "ROLE_SYSTEM",
  SYSTEM: "ROLE_SYSTEM",
  SISTEMA: "ROLE_SYSTEM",
};

/**
 * Normaliza el rol de usuario a uno de los tipos estándar del backend
 * @param role - El rol del usuario (puede estar en diferentes formatos)
 * @returns El rol normalizado
 */
export const normalizeRole = (role: string | undefined | null): UserRole => {
  if (!role) return "ROLE_BUYER"; // Default role
  
  const normalizedRole = ROLE_VARIANTS[role.toUpperCase()];
  return normalizedRole || "ROLE_BUYER"; // Default to ROLE_BUYER if unknown
};

/**
 * Extrae el rol principal del usuario desde el array de roles o campo role
 * @param user - El usuario con roles o role
 * @returns El nombre del rol principal
 */
export const getUserRole = (user: { role?: string; roles?: Array<{ name?: string } | string> } | null | undefined): string | undefined => {
  if (!user) return undefined;
  
  // Si tiene campo role, usarlo directamente
  if (user.role) return user.role;
  
  // Si tiene array de roles, extraer el primer rol
  if (user.roles && user.roles.length > 0) {
    const firstRole = user.roles[0];
    return typeof firstRole === 'string' ? firstRole : firstRole.name;
  }
  
  return undefined;
};

/**
 * Verifica si el usuario tiene permisos de administrador
 * @param role - El rol del usuario
 * @returns true si el usuario es admin
 */
export const isAdmin = (role: string | undefined | null): boolean => {
  return normalizeRole(role) === "ROLE_ADMIN";
};

/**
 * Verifica si el usuario tiene permisos de vendedor o superior
 * @param role - El rol del usuario
 * @returns true si el usuario es vendedor o admin
 */
export const isVendor = (role: string | undefined | null): boolean => {
  const normalized = normalizeRole(role);
  return normalized === "ROLE_SELLER" || normalized === "ROLE_ADMIN" || normalized === "ROLE_MODERATOR";
};

/**
 * Verifica si el usuario debe ver el sidebar (ADMIN o MODERATOR únicamente)
 * @param role - El rol del usuario
 * @returns true si el usuario debe ver el sidebar
 */
export const shouldShowSidebar = (role: string | undefined | null): boolean => {
  const normalized = normalizeRole(role);
  return normalized === "ROLE_ADMIN" || normalized === "ROLE_MODERATOR";
};

/**
 * Verifica si el usuario es solo comprador
 * @param role - El rol del usuario
 * @returns true si el usuario es comprador
 */
export const isCustomer = (role: string | undefined | null): boolean => {
  return normalizeRole(role) === "ROLE_BUYER";
};

/**
 * Obtiene un color de badge según el rol
 * @param role - El rol del usuario
 * @returns Clases de Tailwind para el badge del rol
 */
export const getRoleBadgeClasses = (role: string | undefined | null): string => {
  const normalized = normalizeRole(role);
  
  switch (normalized) {
    case "ROLE_ADMIN":
      return "bg-red-500 text-white";
    case "ROLE_MODERATOR":
      return "bg-purple-500 text-white";
    case "ROLE_SELLER":
      return "bg-blue-500 text-white";
    case "ROLE_BUYER":
      return "bg-green-500 text-white";
    case "ROLE_SYSTEM":
      return "bg-gray-500 text-white";
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
    case "ROLE_ADMIN":
      return "Administrador";
    case "ROLE_MODERATOR":
      return "Moderador";
    case "ROLE_SELLER":
      return "Vendedor";
    case "ROLE_BUYER":
      return "Comprador";
    case "ROLE_SYSTEM":
      return "Sistema";
    default:
      return "Usuario";
  }
};
