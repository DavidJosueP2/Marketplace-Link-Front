import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
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
import type { ModeratorCreateRequest } from "@/services/users/types";
import { ApiError } from "@/services/api";
import usersService from "@/services/users/users.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ModeratorCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  cedula?: string;
  gender?: string;
}

export default function ModeratorCreateModal({ isOpen, onClose }: ModeratorCreateModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ModeratorCreateRequest>({
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    cedula: "",
    gender: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    } else if (formData.username.length < 3) {
      newErrors.username = "Mínimo 3 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\+?\d{7,20}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Teléfono inválido (7-20 dígitos)";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es requerida";
    } else if (formData.cedula.length !== 10) {
      newErrors.cedula = "La cédula debe tener 10 dígitos";
    }

    if (!formData.gender) {
      newErrors.gender = "El género es requerido";
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

    if (!validateForm()) {
      return;
    }

    // Formatear teléfono para el backend (agregar +593 si es necesario)
    const phoneFormatted = formData.phone.startsWith("+")
      ? formData.phone
      : formData.phone.startsWith("0")
      ? `+593${formData.phone.substring(1)}`
      : `+593${formData.phone}`;

    const payload: ModeratorCreateRequest = {
      ...formData,
      phone: phoneFormatted,
    };

    try {
      setIsSubmitting(true);
      await usersService.createModerator(payload);
      
      // Invalidar queries para actualizar la lista
      queryClient.invalidateQueries({ queryKey: ["users-paginated"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      toast.success("Moderador creado", {
        description: `El moderador ${formData.firstName} ${formData.lastName} ha sido creado exitosamente.`,
        duration: 3000,
      });
      
      resetForm();
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
        const message = apiError?.payload?.message || apiError?.message || "Error al crear el moderador";
        toast.error("No se pudo crear el moderador", {
          description: message,
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ModeratorCreateRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof ModeratorCreateRequest) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      cedula: "",
      gender: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-background rounded-lg shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">Crear Moderador</h2>
            <p className="text-sm text-muted-foreground mt-1">
              El moderador recibirá un correo para establecer su contraseña
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
          {/* Nombre de usuario */}
          <div>
            <Label htmlFor="username">
              Nombre de usuario <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              onBlur={() => handleBlur("username")}
              placeholder="ej. jdoe_moderador"
              className="mt-1.5"
            />
            {touched.username && errors.username && (
              <p className="text-xs text-red-600 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                placeholder="Juan"
                className="mt-1.5"
              />
              {touched.firstName && errors.firstName && (
                <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">
                Apellido <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                placeholder="Pérez"
                className="mt-1.5"
              />
              {touched.lastName && errors.lastName && (
                <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">
                Correo electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="correo@ejemplo.com"
                className="mt-1.5"
              />
              {touched.email && errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 mt-1.5">
                <span className="inline-flex items-center px-3 text-sm bg-muted border border-r-0 rounded-l-md text-muted-foreground">
                  +593
                </span>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange("phone", value);
                  }}
                  onBlur={() => handleBlur("phone")}
                  placeholder="998765432"
                  className="rounded-l-none"
                  maxLength={9}
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Cédula y Género */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cedula">
                Cédula <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cedula"
                value={formData.cedula}
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
              <Label htmlFor="gender">
                Género <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.gender}
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

          {/* Info box */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Nota:</strong> El moderador recibirá un correo electrónico con un enlace
              para establecer su contraseña. La cuenta se creará activa y verificada.
            </p>
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
              {isSubmitting ? "Creando..." : "Crear Moderador"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

