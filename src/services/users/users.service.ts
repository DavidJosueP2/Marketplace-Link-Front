import api from "../api";
import type {
  UserResponse,
  ModeratorCreateRequest,
  UserUpdateRequest,
  UsersListParams,
  PaginatedResponse,
} from "./types";

/**
 * Servicio para gestión de usuarios
 * Endpoints para admins y moderadores
 */
const usersService = {
  /**
   * Obtener todos los usuarios
   * Solo para ADMIN
   */
  getAll: async (params?: UsersListParams): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>("/api/users", { params });
    return response.data;
  },

  /**
   * Obtener usuarios paginados con filtros
   * Solo para ADMIN
   */
  getAllPaginated: async (params?: UsersListParams): Promise<PaginatedResponse<UserResponse>> => {
    const response = await api.get<PaginatedResponse<UserResponse>>("/api/users/paginated", { params });
    return response.data;
  },

  /**
   * Obtener un usuario por ID
   */
  getById: async (userId: number): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/api/users/${userId}`);
    return response.data;
  },

  /**
   * Crear un moderador
   * Solo para ADMIN
   */
  createModerator: async (data: ModeratorCreateRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>("/api/users/moderators", data);
    return response.data;
  },

  /**
   * Actualizar información de un usuario
   * Admins y moderadores pueden actualizar usuarios
   * No incluye datos sensibles (email, contraseña, teléfono)
   */
  update: async (userId: number, data: UserUpdateRequest): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/api/users/${userId}`, data);
    return response.data;
  },

  /**
   * Activar un usuario
   * Solo para ADMIN
   */
  activate: async (userId: number): Promise<void> => {
    await api.put(`/api/users/${userId}/activate`);
  },

  /**
   * Desactivar un usuario
   * Solo para ADMIN
   */
  deactivate: async (userId: number): Promise<void> => {
    await api.put(`/api/users/${userId}/deactivate`);
  },

  /**
   * Bloquear un usuario
   * Para ADMIN y MODERATOR
   */
  block: async (userId: number): Promise<void> => {
    await api.put(`/api/users/${userId}/block`);
  },

  /**
   * Desbloquear un usuario
   * Para ADMIN y MODERATOR
   */
  unblock: async (userId: number): Promise<void> => {
    await api.put(`/api/users/${userId}/unblock`);
  },
};

export default usersService;

