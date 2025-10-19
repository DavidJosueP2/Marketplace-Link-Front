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

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  cedula: string;
  gender: string;
  roles: Array<{ roleName: string }>;

  latitude: number;
  longitude: number;
}

export interface VerifyEmailResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export interface ForgotPasswordResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success?: boolean;
  message?: string;
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

  register: async (payload: RegisterPayload): Promise<any> => {
    const response = await api.post("/api/users", payload);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const response = await api.get<VerifyEmailResponse>("/api/auth/verify-email", {
      params: { token },
    });
    return response.data;
  },

  resendVerification: async (token: string): Promise<VerifyEmailResponse> => {
    const response = await api.post<VerifyEmailResponse>(
      `/api/auth/verify-email/resend?token=${encodeURIComponent(token)}`
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>("/api/auth/password/forgot", { email });
    return response.data ?? null;
  },

  resetPassword: async ({ token, newPassword }: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    const payload = { tokenValue: token, newPassword };
    const response = await api.post<ResetPasswordResponse>("/api/auth/password/reset", payload);
    return response.data ?? null;
  },
};

export default authService;
