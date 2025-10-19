import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, clearTokens } from "@/auth/tokenStorage.js";

/**
 * Estructura de error que devuelve la capa de servicios
 */
export interface ApiErrorPayload {
  message: string;
  status?: number;
  data?: any;
  // libre para extensiones (p.ej. 'network' | 'validation' | 'conflict')
  type?: string;
}

export class ApiError extends Error {
  public payload: ApiErrorPayload;
  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.payload = payload;
  }
}

/**
 * Instancia base de Axios usada por la app
 */
export const api: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json; charset=utf-8",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = getAccessToken();
      if (token && config.headers) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // No bloquear la petición si falla la lectura del token
      console.warn("No se pudo leer el token de almacenamiento:", e);
    }
    return config;
  },
  (error) => Promise.reject(new ApiError({ message: error?.message ?? "Request error", data: error })),
);

// Interceptor para manejar respuestas y errores con mejor tipado
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Si no es un error de Axios, reenviarlo
    if (!axios.isAxiosError(error)) {
      return Promise.reject(new ApiError({
        message: "Error desconocido",
        data: error,
      }));
    }

    const status = error.response?.status;
    const reqUrl = error.config?.url ?? "";
    const isLoginEndpoint =
      reqUrl.includes("/auth/login") || reqUrl.endsWith("/auth/login");

    if (status === 401) {
      if (!isLoginEndpoint) {
        clearTokens();
        // Redirigir al login
        (globalThis as any).location.href = "/login";
        return Promise.reject(
          new ApiError({ message: "Unauthorized", status: 401 }),
        );
      }
      return Promise.reject(new ApiError({ message: "Unauthorized", status: 401 }));
    }

    // Si no hay respuesta, es un error de red/timeouts
    if (!error.response) {
      console.error("Error de red:", error.message);
      const payload: ApiErrorPayload = {
        message: "Error de conexión. Verifica tu internet.",
        type: "network",
      };
      return Promise.reject(new ApiError(payload));
    }

    // Log para diagnóstico (no optimizar fuera de desarrollo)
    /* eslint-disable no-console */
    console.log("Error completo de la API:", {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
    });
    /* eslint-enable no-console */

    // Manejo específico para errores de validación (400)
    const data = error.response.data as Record<string, any> | undefined;

    if (error.response.status === 400 && data?.errors) {
      const payload: ApiErrorPayload = {
        message: data?.message || data?.detail || "Errores de validación",
        status: error.response.status,
        data,
        type: "validation",
      };
      return Promise.reject(new ApiError(payload));
    }

    // Extraer mensaje de error del servidor
    let errorMessage: string | undefined =
      data?.message || data?.detail || data?.error || undefined;

    if (error.response.status === 409 && !errorMessage) {
      errorMessage = "Error de conflicto.";
    }

    const payload: ApiErrorPayload = {
      message: errorMessage ?? "Ha ocurrido un error inesperado",
      status: error.response.status,
      data,
    };

    return Promise.reject(new ApiError(payload));
  },
);

export default api;
