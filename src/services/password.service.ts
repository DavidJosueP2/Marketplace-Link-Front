import api from "./api";

export interface RequestResetInput {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message?: string;
  [key: string]: any;
}

const passwordService = {
  requestReset: async (input: RequestResetInput): Promise<PasswordResetResponse> => {
    try {
      const response = await api.post<PasswordResetResponse>(`/auth/request-reset`, input);
      return response.data;
    } catch (err: any) {
      console.error("Error en requestReset:", err);
      // Re-lanzar el error para que los consumidores lo manejen (ApiError será lanzado desde api)
      throw err;
    }
  },

  reset: async (token: string, newPassword: string): Promise<PasswordResetResponse> => {
    try {
      const response = await api.post<PasswordResetResponse>(`/auth/reset-password`, { token, newPassword });
      return response.data;
    } catch (err: any) {
      console.error("Error en reset:", err);
      throw err;
    }
  },
};

export default passwordService;
