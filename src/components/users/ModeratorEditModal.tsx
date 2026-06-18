import { useState, useEffect, type FormEvent } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import type { UserResponse, UserUpdateRequest } from "@/services/users/types";
import { ApiError } from "@/services/api";
import usersService from "@/services/users/users.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ModeratorEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  moderator: UserResponse | null;
}

interface FormErrors {
  username?: string;
  firstName?: string;
  lastName?: string;
  cedula?: string;
  gender?: string;
}

export default function ModeratorEditModal({ isOpen, onClose, moderator }: ModeratorEditModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UserUpdateRequest>({
    username: "",
    firstName: "",
    lastName: "",
    cedula: "",
    gender: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (moderator) {
      setFormData({
        username: moderator.username,
        firstName: moderator.firstName,
        lastName: moderator.lastName,
        cedula: moderator.cedula,
        gender: moderator.gender,
      });
    }
  }, [moderator]);

  if (!isOpen || !moderator) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.username && formData.username.trim().length < 3) {
      newErrors.username = "Mínimo 3 caracteres";
    }

    if (formData.firstName && formData.firstName.length > 50) {
      newErrors.firstName = "El nombre no puede exceder 50 caracteres";
    }

    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = "El apellido no puede exceder 50 caracteres";
    }

    if (formData.cedula && formData.cedula.length !== 10) {
      newErrors.cedula = "La cédula debe tener 10 dígitos";
    }

    setErrors(newErrors);
    Object.keys(newErrors).forEach(key => setTouched(prev => ({ ...prev, [key]: true })));
    return Object.keys(newErrors).length === 0;
  };

  const applyBackendErrors = (backendErrors: Record<string, any>) => {
    const normalized: FormErrors = {};
    for (const [field, msg] of Object.entries(backendErrors)) {
      if (field in formData) {
        normalized[field as keyof FormErrors] = String(msg);
      }
    }
    setErrors(prev => ({ ...prev, ...normalized }));
    Object.keys(normalized).forEach(key => setTouched(prev => ({ ...prev, [key]: true })));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !moderator) {
      return;
    }

    // Solo enviar campos que no estén vacíos
    const dataToSend: UserUpdateRequest = {};
    if (formData.username?.trim()) dataToSend.username = formData.username.trim();
    if (formData.firstName?.trim()) dataToSend.firstName = formData.firstName.trim();
    if (formData.lastName?.trim()) dataToSend.lastName = formData.lastName.trim();
    if (formData.cedula?.trim()) dataToSend.cedula = formData.cedula.trim();
    if (formData.gender) dataToSend.gender = formData.gender;

    try {
      setIsSubmitting(true);
      await usersService.update(moderator.id, dataToSend);

      // Invalidar queries para actualizar la lista
      queryClient.invalidateQueries({ queryKey: ["users-paginated"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("Moderador actualizado", {
        description: `Los datos de ${formData.firstName || moderator.firstName} han sido actualizados correctamente.`,
        duration: 3000,
      });

      setErrors({});
      setTouched({});
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      const backendErrors = (apiError?.payload?.data as any)?.errors || null;

      if (backendErrors && typeof backendErrors === "object") {
        applyBackendErrors(backendErrors);
        toast.error("Error de validación", {
          description: "Por favor revisa los campos marcados en rojo.",
          duration: 4000,
        });
      } else {
        const message = apiError?.payload?.message || apiError?.message || "Error al actualizar el moderador";
        toast.error("No se pudo actualizar el moderador", {
          description: message,
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof UserUpdateRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al cambiar
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof UserUpdateRequest) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleClose = () => {
    setErrors({});
    setTouched({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-background rounded-lg shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">Editar Moderador</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Actualizando información de {moderator.fullName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-muted transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Información no editable */}
          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span>{" "}
              <span className="text-muted-foreground">{moderator.email}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Teléfono:</span>{" "}
              <span className="text-muted-foreground">{moderator.phone}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Estado:</span>{" "}
              <span className="text-muted-foreground">{moderator.accountStatus}</span>
            </p>
            <div className="flex items-start gap-2 mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                Los datos sensibles (email, teléfono, contraseña) no pueden ser modificados desde aquí
              </p>
            </div>
          </div>

          {/* Nombre de usuario */}
          <div>
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              value={formData.username || ""}
              onChange={(e) => handleChange("username", e.target.value)}
              onBlur={() => handleBlur("username")}
              placeholder="ej. jdoe_mod"
              className="mt-1.5"
            />
            {touched.username && errors.username && (
              <p className="text-xs text-red-600 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName || ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                placeholder="Juan"
                className="mt-1.5"
                maxLength={50}
              />
              {touched.firstName && errors.firstName && (
                <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                placeholder="Pérez"
                className="mt-1.5"
                maxLength={50}
              />
              {touched.lastName && errors.lastName && (
                <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Cédula y Género */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                value={formData.cedula || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("cedula", value);
                }}
                onBlur={() => handleBlur("cedula")}
                placeholder="1234567890"
                className="mt-1.5"
                maxLength={10}
              />
              {touched.cedula && errors.cedula && (
                <p className="text-xs text-red-600 mt-1">{errors.cedula}</p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Género</Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) => {
                  handleChange("gender", value);
                  handleBlur("gender");
                }}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecciona un género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Masculino</SelectItem>
                  <SelectItem value="FEMALE">Femenino</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
              {touched.gender && errors.gender && (
                <p className="text-xs text-red-600 mt-1">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF9900] hover:bg-[#CC7A00]"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
