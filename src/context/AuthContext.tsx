import { createContext, useEffect, useState, useMemo } from "react";
import {
  getAccessToken,
  setAccessToken,
  clearTokens,
} from "@/auth/tokenStorage.js";
import authService from "@/services/auth.service.js";

interface User {
  id?: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  roles?: (string | { name?: string })[];
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (dni: string, password: string) => Promise<{ success: boolean; user?: User; errorData?: any }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica si hay token al iniciar
  useEffect(() => {
    let timedOut = false;
    const guard = setTimeout(() => {
      timedOut = true;
      setIsLoading(false);
    }, 3000);

    (async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch (e) {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        const error = e as { message?: string };
        console.error("Auth init failed:", error?.message || e);
      } finally {
        if (!timedOut) setIsLoading(false);
        clearTimeout(guard);
      }
    })();

    return () => clearTimeout(guard);
  }, []);

  // LOGIN
  const login = async (dni: string, password: string) => {
    try {
      const data = await authService.login(dni, password);
      const token = data?.accessToken;
      const profile =
        data?.user ??
        (token
          ? (setAccessToken(token), await authService.getProfile())
          : null);

      if (!token || !profile) throw new Error("Credenciales inválidas");

      setAccessToken(token);
      setUser(profile);
      setIsAuthenticated(true);
      return { success: true, user: profile };
    } catch (error) {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      const err = error as { errorData?: any };
      return {
        success: false,
        errorData: err?.errorData ?? null,
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      const err = error as { message?: string };
      console.error("Logout error:", err?.message || error);
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Actualizar perfil del usuario en memoria
  const updateUser = (userData: Partial<User>) =>
    setUser((prev) => (prev ? { ...prev, ...userData } : userData as User));

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated, login, logout, updateUser }),
    [user, isLoading, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="min-h-dvh flex items-center justify-center bg-[var(--ui-bg)] text-[var(--ui-ink)]">
          <div className="size-12 animate-spin rounded-full border-b-2 border-brand-600" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
