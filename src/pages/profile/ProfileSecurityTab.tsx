import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Button } from "@/components/ui/shadcn/button";
import type { ChangePasswordPayload } from "@/services/user.service";

interface ProfileSecurityTabProps {
  updating: boolean;
  onChangePassword: (payload: ChangePasswordPayload) => Promise<boolean>;
  theme: "light" | "dark";
  errors: Record<string, string>;
  clearFieldError: (fieldName: string) => void;
}

const Eye = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
    <path
      d="M12 5c-5 0-9 5-9 7s4 7 9 7 9-5 9-7-4-7-9-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
      fill="currentColor"
    />
  </svg>
);

const EyeOff = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
    <path
      d="M3 3l18 18M10 5.2A9.8 9.8 0 0 1 12 5c5 0 9 5 9 7a9.6 9.6 0 0 1-2.2 4.4M6.3 6.3A9.5 9.5 0 0 0 3 12c0 2 4 7 9 7 1.7 0 3.3-.4 4.7-1.1M9 9a5 5 0 0 0 6 6"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
  reveal: boolean;
  onToggleReveal: () => void;
  error?: string;
  isDark: boolean;
  autoComplete?: string;
}

function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  reveal,
  onToggleReveal,
  error,
  isDark,
  autoComplete,
}: Readonly<PasswordFieldProps>) {
  const labelClassName = isDark ? "text-gray-200" : "";
  const inputClassName = isDark ? "bg-[#0F151C] border-gray-600 text-white" : "";

  return (
    <div>
      <Label htmlFor={id} className={`flex items-center justify-between ${labelClassName}`}>
        <span>{label}</span>
        <button
          type="button"
          onClick={onToggleReveal}
          aria-label={reveal ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-foreground/5"
        >
          {reveal ? <EyeOff /> : <Eye />}
        </button>
      </Label>
      <Input
        id={id}
        name={name}
        type={reveal ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`mt-1.5 ${inputClassName}`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

// Función auxiliar para validar contraseña
const validatePasswordField = (password: string, fieldName: string): string => {
  if (!password) {
    const messages: Record<string, string> = {
      currentPassword: "La contraseña actual es requerida",
      newPassword: "La nueva contraseña es requerida",
      confirmPassword: "Debes confirmar la nueva contraseña",
    };
    return messages[fieldName] || "";
  }

  if (fieldName === "newPassword") {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    if (password.length > 72) return "La contraseña no debe exceder 72 caracteres";
  }

  return "";
};

// Función auxiliar para validar el formulario de seguridad
const validateSecurityForm = (formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const newErrors: Record<string, string> = {};

  const currentError = validatePasswordField(formData.currentPassword, "currentPassword");
  if (currentError) {
    newErrors.currentPassword = currentError;
  }

  const newPasswordError = validatePasswordField(formData.newPassword, "newPassword");
  if (newPasswordError) {
    newErrors.newPassword = newPasswordError;
  }

  const confirmError = validatePasswordField(formData.confirmPassword, "confirmPassword");
  if (confirmError) {
    newErrors.confirmPassword = confirmError;
  }

  const passwordsDontMatch = formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword;
  if (passwordsDontMatch) {
    newErrors.confirmPassword = "Las contraseñas no coinciden";
  }

  const samePassword = formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword;
  if (samePassword) {
    newErrors.newPassword = "La nueva contraseña debe ser diferente a la actual";
  }

  return newErrors;
};

// Función auxiliar para combinar errores
const mergeErrors = (
  localErrors: Record<string, string>,
  backendErrors: Record<string, string>
): Record<string, string> => {
  const merged = { ...localErrors, ...backendErrors };
  if (backendErrors.confirmNewPassword) {
    merged.confirmPassword = backendErrors.confirmNewPassword;
  }
  return merged;
};

// Función auxiliar para obtener clases de tema
const getThemeClasses = (isDark: boolean) => ({
  headerBg: isDark ? "bg-[#0F151C] border-gray-700" : "bg-muted/50",
  headerText: isDark ? "text-gray-200" : "",
  headerSubtext: isDark ? "text-gray-400" : "text-muted-foreground",
  buttonBorder: isDark ? "border-gray-600 hover:bg-gray-800" : "",
});

// Hook personalizado para manejar el estado del formulario
function useSecurityFormState(backendErrors: Record<string, string>, clearFieldError: (field: string) => void) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [reveal, setReveal] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearErrors = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }

    if (backendErrors[fieldName]) {
      clearFieldError(fieldName);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearErrors(name);

    if (name === "confirmPassword" && backendErrors.confirmNewPassword) {
      clearFieldError("confirmNewPassword");
    }
  };

  const toggleReveal = (field: "current" | "new" | "confirm") => {
    setReveal((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = (): boolean => {
    const newErrors = validateSecurityForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return {
    formData,
    reveal,
    errors,
    handleChange,
    toggleReveal,
    validateForm,
    resetForm,
  };
}

export default function ProfileSecurityTab({ updating, onChangePassword, theme, errors: backendErrors, clearFieldError }: Readonly<ProfileSecurityTabProps>) {
  const {
    formData,
    reveal,
    errors,
    handleChange,
    toggleReveal,
    validateForm,
    resetForm,
  } = useSecurityFormState(backendErrors, clearFieldError);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onChangePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmPassword,
    });

    if (success) {
      resetForm();
    }
  };

  const allErrors = mergeErrors(errors, backendErrors);
  const isDark = theme === "dark";
  const themeClasses = getThemeClasses(isDark);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className={`rounded-lg border p-4 ${themeClasses.headerBg}`}>
          <p className={`text-sm font-medium ${themeClasses.headerText}`}>Cambiar Contraseña</p>
          <p className={`text-xs mt-1 ${themeClasses.headerSubtext}`}>
            Asegúrate de utilizar una contraseña segura, que contenga al menos 8 caracteres,
            incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.
          </p>
        </div>

        <PasswordField
          id="currentPassword"
          name="currentPassword"
          label="Contraseña Actual"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Tu contraseña actual"
          disabled={updating}
          reveal={reveal.current}
          onToggleReveal={() => toggleReveal("current")}
          error={allErrors.currentPassword}
          isDark={isDark}
          autoComplete="current-password"
        />

        <PasswordField
          id="newPassword"
          name="newPassword"
          label="Nueva Contraseña"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Tu nueva contraseña"
          disabled={updating}
          reveal={reveal.new}
          onToggleReveal={() => toggleReveal("new")}
          error={allErrors.newPassword}
          isDark={isDark}
          autoComplete="new-password"
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar Nueva Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirma tu nueva contraseña"
          disabled={updating}
          reveal={reveal.confirm}
          onToggleReveal={() => toggleReveal("confirm")}
          error={allErrors.confirmPassword}
          isDark={isDark}
          autoComplete="new-password"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={updating}
          className={themeClasses.buttonBorder}
        >
          Limpiar
        </Button>
        <Button
          type="submit"
          disabled={updating}
          className="bg-[#FF9900] hover:bg-[#CC7A00] text-white"
        >
          {updating ? "Cambiando..." : "Cambiar Contraseña"}
        </Button>
      </div>
    </form>
  );
}
