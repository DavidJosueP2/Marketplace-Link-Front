import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Button } from "@/components/ui/shadcn/button";
import { Combobox } from "@/components/ui/inputs/combobox";
import type { UserResponse } from "@/services/auth/interfaces/UserResponse";
import type { UpdateUserPayload } from "@/services/user.service";
import { GENDERS } from "@/pages/auth/register/constants";

interface ProfilePersonalTabProps {
  profile: UserResponse;
  updating: boolean;
  onUpdate: (payload: UpdateUserPayload) => Promise<boolean>;
  theme: "light" | "dark";
  errors: Record<string, string>;
  clearFieldError: (fieldName: string) => void;
}

export default function ProfilePersonalTab({ profile, updating, onUpdate, theme, errors: backendErrors, clearFieldError }: Readonly<ProfilePersonalTabProps>) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    cedula: profile.cedula,
    gender: profile.gender,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error local
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Limpiar error del backend
    if (backendErrors[name]) {
      clearFieldError(name);
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
    // Limpiar errores al cambiar el género
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
    if (backendErrors.gender) {
      clearFieldError("gender");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName || formData.firstName.trim().length === 0) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName || formData.lastName.trim().length === 0) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.cedula || formData.cedula.length !== 10) {
      newErrors.cedula = "La cédula debe tener exactamente 10 dígitos";
    } else if (!/^\d{10}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula solo debe contener números";
    }

    if (!formData.gender) {
      newErrors.gender = "Debes seleccionar un género";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: UpdateUserPayload = {};

    if (formData.firstName !== profile.firstName) {
      payload.firstName = formData.firstName;
    }
    if (formData.lastName !== profile.lastName) {
      payload.lastName = formData.lastName;
    }
    if (formData.cedula !== profile.cedula) {
      payload.cedula = formData.cedula;
    }
    if (formData.gender !== profile.gender) {
      payload.gender = formData.gender;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    await onUpdate(payload);
  };

  const hasChanges =
    formData.firstName !== profile.firstName ||
    formData.lastName !== profile.lastName ||
    formData.cedula !== profile.cedula ||
    formData.gender !== profile.gender;

  // Combinar errores locales y del backend
  const allErrors = { ...errors, ...backendErrors };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className={theme === "dark" ? "text-gray-200" : ""}>Nombre</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={updating}
              className={`mt-1.5 ${theme === "dark" ? "bg-[#0F151C] border-gray-600 text-white" : ""}`}
            />
            {allErrors.firstName && (
              <p className="text-xs text-red-600 mt-1">{allErrors.firstName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName" className={theme === "dark" ? "text-gray-200" : ""}>Apellido</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Tu apellido"
              disabled={updating}
              className={`mt-1.5 ${theme === "dark" ? "bg-[#0F151C] border-gray-600 text-white" : ""}`}
            />
            {allErrors.lastName && (
              <p className="text-xs text-red-600 mt-1">{allErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cedula" className={theme === "dark" ? "text-gray-200" : ""}>Cédula</Label>
            <Input
              id="cedula"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="10 dígitos"
              disabled={updating}
              maxLength={10}
              className={`mt-1.5 ${theme === "dark" ? "bg-[#0F151C] border-gray-600 text-white" : ""}`}
            />
            {allErrors.cedula && (
              <p className="text-xs text-red-600 mt-1">{allErrors.cedula}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gender" className={theme === "dark" ? "text-gray-200" : ""}>Género</Label>
            <div className="mt-1.5">
              <Combobox
                options={GENDERS}
                value={formData.gender}
                onValueChange={handleGenderChange}
                placeholder="Selecciona tu género"
                searchPlaceholder="Buscar..."
                disabled={updating}
              />
            </div>
            {allErrors.gender && (
              <p className="text-xs text-red-600 mt-1">{allErrors.gender}</p>
            )}
          </div>
        </div>

        <div className={`rounded-lg border p-4 ${theme === "dark" ? "bg-[#0F151C] border-gray-700" : "bg-muted/50"}`}>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : ""}`}>Roles asignados</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.roles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF9900] text-white"
                  >
                    {role.name.replace("ROLE_", "")}
                  </span>
                ))}
              </div>
              <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
                Los roles no se pueden modificar desde el perfil
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              firstName: profile.firstName,
              lastName: profile.lastName,
              cedula: profile.cedula,
              gender: profile.gender,
            });
            setErrors({});
          }}
          disabled={updating || !hasChanges}
          className={theme === "dark" ? "border-gray-600 hover:bg-gray-800" : ""}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={updating || !hasChanges}
          className="bg-[#FF9900] hover:bg-[#CC7A00] text-white"
        >
          {updating ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
