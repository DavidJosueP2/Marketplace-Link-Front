import api from "./api";
import { clearTokens, setAccessToken } from "@/auth/tokenStorage.js";

const baseUrl = import.meta.env.VITE_API_URL;

const authService = {
  login: async (email, password) => {
    const resp = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) {
      let errBody;
      try { errBody = await resp.json(); } catch { errBody = null; }
      throw {
        success: false,
        errorData: {
          statusCode: resp.status,
          message: errBody?.message ?? resp.statusText,
          details: errBody,
        },
      };
    }

    const data = await resp.json();

    if (!data?.token) {
      throw {
        success: false,
        errorData: {
          statusCode: 500,
          message: "Respuesta inválida del servidor: falta 'token'",
          details: data,
        },
      };
    }

    setAccessToken(data.token);

    return {
      ...data,
      accessToken: data.token,
      success: true,
    };
  },

  logout: async () => {
    clearTokens();
    return { success: true };
  },

  getProfile: async () => {
    const response = await api.get(`${baseUrl}/api/auth/profile`);
    return response.data;
  },
};

export default authService;
