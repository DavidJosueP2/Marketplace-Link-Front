/**
 * Tipos e interfaces para la gestión de usuarios
 */

export interface RoleResponse {
  id: number;
  name: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  cedula: string;
  gender: string;
  accountStatus: string;
  roles: RoleResponse[];
  latitude: number | null;
  longitude: number | null;
}

export interface ModeratorCreateRequest {
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  cedula: string;
  gender: string;
}

export interface UserUpdateRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  cedula?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
}

export interface UsersListParams {
  page?: number;
  size?: number;
  search?: string;
  roles?: string[]; // Array de roles para filtrar
  includeDeleted?: boolean; // Para incluir usuarios eliminados
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  pendingVerification: number;
  totalBuyers: number;
  totalVendors: number;
  totalModerators: number;
}

// Tipos de AccountStatus según el backend
export type AccountStatus = 
  | "ACTIVE" 
  | "INACTIVE" 
  | "BLOCKED" 
  | "PENDING_VERIFICATION";

// Tipos de Gender según el backend
export type Gender = "MALE" | "FEMALE" | "OTHER";

// Helper para obtener el display name de un estado
export const getAccountStatusLabel = (status: AccountStatus): string => {
  const labels: Record<AccountStatus, string> = {
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
    BLOCKED: "Bloqueado",
    PENDING_VERIFICATION: "Pendiente de verificación",
  };
  return labels[status] || status;
};

// Helper para obtener el display name de un género
export const getGenderLabel = (gender: Gender): string => {
  const labels: Record<Gender, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    OTHER: "Otro",
  };
  return labels[gender] || gender;
};

// Helper para obtener el nombre del rol limpio
export const getRoleLabel = (roleName: string): string => {
  return roleName.replace("ROLE_", "");
};

// Helper para verificar si un usuario tiene un rol específico
export const hasRole = (user: UserResponse, roleName: string): boolean => {
  return user.roles.some(role => role.name === roleName || role.name === `ROLE_${roleName}`);
};

