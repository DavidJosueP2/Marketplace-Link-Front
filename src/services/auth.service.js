import api from "@/services/api";
import { clearTokens, setAccessToken } from "@/auth/tokenStorage.js";

const baseUrl = import.meta.env.VITE_API_URL;

export async function verifyEmail(token) {
  const res = await api.get("/api/auth/verify-email", { params: { token } });
  return res.data;
}

export async function resendVerification(token) {
  const res = await api.post(`/api/auth/verify-email/resend?token=${encodeURIComponent(token)}`);
  return res.data;
}

export async function forgotPassword(email) {
  const res = await api.post("/api/auth/password/forgot", { email });
  return res.data ?? null;
}

export async function resetPassword({ token, newPassword }) {
  const payload = { tokenValue: token, newPassword };
  const res = await api.post("/api/auth/password/reset", payload);
  return res.data ?? null;
}

export async function login(email, password) {
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
}

export async function logout() {
  clearTokens();
  return { success: true };
}

export async function getProfile() {
  const response = await api.get(`${baseUrl}/api/auth/profile`);
  return response.data;
}

export async function register(payload) {
  const res = await api.post("/api/users", payload);
  return res.data;
}

const authService = {
  login,
  logout,
  getProfile,
  register,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};

export default authService;
