import api from "./api";
import { clearTokens, setAccessToken } from "@/auth/tokenStorage";

const baseUrl = (import.meta.env.VITE_API_URL as string) || "";

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  [key: string]: any;
}

export interface LoginResult {
  success: boolean;
  accessToken?: string;
  [key: string]: any;
}

const authService = {
  login: async (email: string, password: string): Promise<LoginResult> => {
    const response = await api.post<LoginResponse>(`/login`, { email, password });
    const data = response.data;

    if (!data?.token) {
      throw new Error("Respuesta inválida del servidor: falta 'token'");
    }

    setAccessToken(data.token);

    return {
      ...data,
      accessToken: data.token,
      success: true,
    } as LoginResult;
  },

  logout: async (): Promise<{ success: boolean }> => {
    clearTokens();
    return { success: true };
  },

  getProfile: async (): Promise<any> => {
    const response = await api.get(`${baseUrl}/api/auth/profile`);
    return response.data;
  },
};

export default authService;
