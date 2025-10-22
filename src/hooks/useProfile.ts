import { useState, useEffect } from "react";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import userService, { type UpdateUserPayload, type ChangePasswordPayload } from "@/services/user.service";
import type { UserResponse } from "@/services/auth/interfaces/UserResponse";
import { ApiError } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";

export function useProfile() {
  const { updateUser } = useAuth(); // Para actualizar el contexto global
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("account");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await authService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const applyBackendErrors = (backendErrors: Record<string, any>) => {
    const normalized: Record<string, string> = {};

    for (const [field, msg] of Object.entries(backendErrors)) {
      normalized[field] = String(msg);
    }

    setErrors(normalized);

    // Determinar en qué tab está el primer error y cambiar a ese tab
    const accountFields = ["username", "email", "phone", "latitude", "longitude"];
    const personalFields = ["firstName", "lastName", "cedula", "gender"];
    const securityFields = ["currentPassword", "newPassword", "confirmNewPassword"];

    const errorFields = Object.keys(normalized);

    if (errorFields.some((field) => accountFields.includes(field))) {
      setActiveTab("account");
    } else if (errorFields.some((field) => personalFields.includes(field))) {
      setActiveTab("personal");
    } else if (errorFields.some((field) => securityFields.includes(field))) {
      setActiveTab("security");
    }

    toast.error("Error de validación en campos");
  };

  const updateProfile = async (payload: UpdateUserPayload): Promise<boolean> => {
    if (!profile) return false;

    // Limpiar errores antes de enviar
    setErrors({});

    try {
      setUpdating(true);
      const updatedProfile = await userService.updateProfile(profile.id, payload);
      setProfile(updatedProfile);
      
      // ✨ Actualizar el contexto global de autenticación para que se refleje en el header
      updateUser(updatedProfile);
      
      toast.success("Perfil actualizado correctamente");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof ApiError) {
        const details = error?.payload?.data || {};
        const backendErrors = details?.errors || error?.payload?.data?.errors || null;

        if (backendErrors && typeof backendErrors === "object") {
          applyBackendErrors(backendErrors);
        } else {
          toast.error(error.payload.message || "Error al actualizar el perfil");
        }
      } else {
        toast.error("Error al actualizar el perfil");
      }
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const changePassword = async (payload: ChangePasswordPayload): Promise<boolean> => {
    if (!profile) return false;

    // Limpiar errores antes de enviar
    setErrors({});

    try {
      setUpdating(true);
      await userService.changePassword(profile.id, payload);
      toast.success("Contraseña actualizada correctamente");
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      if (error instanceof ApiError) {
        const details = error?.payload?.data || {};
        const backendErrors = details?.errors || error?.payload?.data?.errors || null;

        if (backendErrors && typeof backendErrors === "object") {
          applyBackendErrors(backendErrors);
        } else {
          toast.error(error.payload.message || "Error al cambiar la contraseña");
        }
      } else {
        toast.error("Error al cambiar la contraseña");
      }
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const clearFieldError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return {
    profile,
    loading,
    updating,
    errors,
    activeTab,
    setActiveTab,
    updateProfile,
    changePassword,
    reloadProfile: loadProfile,
    clearFieldError,
  };
}