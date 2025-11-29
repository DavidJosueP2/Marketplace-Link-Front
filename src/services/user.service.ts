import api from "./api";
import type { UserResponse } from "@/services/auth/interfaces/UserResponse";

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  cedula?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const userService = {
  /**
   * Actualizar datos del perfil del usuario
   */
  updateProfile: async (userId: number, payload: UpdateUserPayload): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/api/users/${userId}`, payload);
    return response.data;
  },

  /**
   * Cambiar contraseña del usuario
   */
  changePassword: async (userId: number, payload: ChangePasswordPayload): Promise<void> => {
    await api.put(`/api/users/${userId}/change-password`, payload);
  },
};

export default userService;
