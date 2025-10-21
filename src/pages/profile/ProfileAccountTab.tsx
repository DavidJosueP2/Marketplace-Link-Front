import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Button } from "@/components/ui/shadcn/button";
import { MapPin } from "lucide-react";
import type { UserResponse } from "@/services/auth/interfaces/UserResponse";
import type { UpdateUserPayload } from "@/services/user.service";

interface ProfileAccountTabProps {
  profile: UserResponse;
  updating: boolean;
  onUpdate: (payload: UpdateUserPayload) => Promise<boolean>;
  theme: "light" | "dark";
  errors: Record<string, string>;
  clearFieldError: (fieldName: string) => void;
}

// Componente de campo de texto
interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
  error?: string;
  isDark: boolean;
  type?: string;
}

function TextField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  isDark,
  type = "text",
}: Readonly<TextFieldProps>) {
  return (
    <div>
      <Label htmlFor={id} className={isDark ? "text-gray-200" : ""}>
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-1.5 ${isDark ? "bg-[#0F151C] border-gray-600 text-white" : ""}`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

// Componente de ubicación
interface LocationSectionProps {
  coords: { lat: number | null; lng: number | null };
  locStatus: "idle" | "requesting" | "granted" | "denied" | "error";
  locMsg: string;
  onAskLocation: () => void;
  updating: boolean;
  errors: { latitude?: string; longitude?: string };
  isDark: boolean;
}

function LocationSection({
  coords,
  locStatus,
  locMsg,
  onAskLocation,
  updating,
  errors,
  isDark,
}: Readonly<LocationSectionProps>) {
  const hasCoords = coords.lat !== null && coords.lng !== null;
  const bgClass = isDark ? "bg-[#0F151C] border-gray-700" : "bg-muted/50";
  const textClass = isDark ? "text-gray-200" : "";
  const subtextClass = isDark ? "text-gray-400" : "text-muted-foreground";
  const buttonClass = isDark ? "border-gray-600 hover:bg-gray-800" : "";

  return (
    <div className={`rounded-lg border p-4 ${bgClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[#FF9900]" />
            <p className={`text-sm font-medium ${textClass}`}>Ubicación</p>
            {locStatus === "granted" && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-600 text-white text-xs">
                ✓
              </span>
            )}
          </div>
          <p className={`text-xs ${subtextClass}`}>
            {hasCoords
              ? `Lat: ${coords.lat!.toFixed(6)}, Lng: ${coords.lng!.toFixed(6)}`
              : "Sin ubicación registrada"}
          </p>
          {locMsg && (
            <p className={`text-xs mt-2 ${locStatus === "granted" ? "text-green-600" : "text-red-600"}`}>
              {locMsg}
            </p>
          )}
          {(errors.latitude || errors.longitude) && (
            <p className="text-xs text-red-600 mt-2">{errors.latitude || errors.longitude}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onAskLocation}
          disabled={locStatus === "requesting" || updating}
          className={buttonClass}
        >
          {locStatus === "requesting" ? "Obteniendo…" : "Actualizar ubicación"}
        </Button>
      </div>
      <p className={`text-xs mt-3 ${subtextClass}`}>
        Tu ubicación se utiliza para mejorar la experiencia en la plataforma y mostrar productos cercanos.
      </p>
    </div>
  );
}

// Función auxiliar para validar email
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Función auxiliar para validar teléfono
const isValidPhone = (phone: string): boolean => {
  return /^\+?\d{7,20}$/.test(phone.replace(/\s/g, ""));
};

// Función auxiliar para validar el formulario
const validateAccountForm = (formData: { username: string; email: string; phone: string }) => {
  const newErrors: Record<string, string> = {};

  if (!formData.username || formData.username.trim().length < 3) {
    newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres";
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    newErrors.email = "El correo electrónico no es válido";
  }

  if (formData.phone && !isValidPhone(formData.phone)) {
    newErrors.phone = "El teléfono debe ser un número válido";
  }

  return newErrors;
};

// Función auxiliar para construir el payload de actualización
const buildUpdatePayload = (
  formData: { username: string; email: string; phone: string },
  profile: UserResponse,
  coords: { lat: number | null; lng: number | null }
): UpdateUserPayload => {
  const payload: UpdateUserPayload = {};

  if (formData.username !== profile.username) {
    payload.username = formData.username;
  }
  if (formData.email !== profile.email) {
    payload.email = formData.email;
  }
  if (formData.phone !== profile.phone) {
    payload.phone = formData.phone;
  }

  const hasValidCoords = coords.lat !== null && coords.lng !== null;
  const coordsChanged = hasValidCoords && (coords.lat !== profile.latitude || coords.lng !== profile.longitude);

  if (coordsChanged) {
    payload.latitude = coords.lat!;
    payload.longitude = coords.lng!;
  }

  return payload;
};

// Función auxiliar para verificar si hay cambios
const hasFormChanges = (
  formData: { username: string; email: string; phone: string },
  profile: UserResponse,
  coords: { lat: number | null; lng: number | null }
): boolean => {
  const basicFieldsChanged =
    formData.username !== profile.username ||
    formData.email !== profile.email ||
    formData.phone !== profile.phone;

  const hasValidCoords = coords.lat !== null && coords.lng !== null;
  const coordsChanged = hasValidCoords && (coords.lat !== profile.latitude || coords.lng !== profile.longitude);

  return basicFieldsChanged || coordsChanged;
};

// Función auxiliar para obtener mensaje de error de geolocalización
const getGeolocationErrorMessage = (errorCode: number): string => {
  if (errorCode === 1) {
    return "Debes permitir la ubicación para actualizarla.";
  }
  return "No se pudo obtener tu ubicación.";
};

// Hook personalizado para manejar el estado del formulario
function useAccountFormState(
  profile: UserResponse,
  backendErrors: Record<string, string>,
  clearFieldError: (field: string) => void
) {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
    phone: profile.phone,
  });

  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: profile.latitude,
    lng: profile.longitude,
  });

  const [locStatus, setLocStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle");
  const [locMsg, setLocMsg] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (backendErrors[name]) {
      clearFieldError(name);
    }
  };

  const handleGeolocationSuccess = (position: GeolocationPosition) => {
    setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
    setLocStatus("granted");
    setLocMsg("Ubicación obtenida correctamente.");
  };

  const handleGeolocationError = (error: GeolocationPositionError) => {
    const status = error.code === 1 ? "denied" : "error";
    setLocStatus(status);
    setLocMsg(getGeolocationErrorMessage(error.code));
  };

  const askLocation = () => {
    setLocStatus("requesting");
    setLocMsg("");

    if (!("geolocation" in navigator)) {
      setLocStatus("error");
      setLocMsg("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handleGeolocationSuccess,
      handleGeolocationError,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const validateForm = (): boolean => {
    const newErrors = validateAccountForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
    });
    setCoords({
      lat: profile.latitude,
      lng: profile.longitude,
    });
    setErrors({});
    setLocStatus("idle");
    setLocMsg("");
  };

  return {
    formData,
    coords,
    locStatus,
    locMsg,
    errors,
    handleChange,
    askLocation,
    validateForm,
    handleReset,
  };
}

export default function ProfileAccountTab({ profile, updating, onUpdate, theme, errors: backendErrors, clearFieldError }: Readonly<ProfileAccountTabProps>) {
  const {
    formData,
    coords,
    locStatus,
    locMsg,
    errors,
    handleChange,
    askLocation,
    validateForm,
    handleReset,
  } = useAccountFormState(profile, backendErrors, clearFieldError);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = buildUpdatePayload(formData, profile, coords);

    if (Object.keys(payload).length === 0) {
      return;
    }

    await onUpdate(payload);
  };

  const hasChanges = hasFormChanges(formData, profile, coords);
  const allErrors = { ...errors, ...backendErrors };
  const isDark = theme === "dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Correo - Solo lectura */}
        <div>
          <Label htmlFor="email" className={isDark ? "text-gray-200" : ""}>
            Correo Electrónico
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            readOnly
            disabled
            className={`mt-1.5 ${isDark ? "bg-[#0F151C] border-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
            title="El correo electrónico no puede ser modificado"
          />
          <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            El correo electrónico no puede ser modificado
          </p>
        </div>

        <TextField
          id="username"
          name="username"
          label="Nombre de Usuario"
          value={formData.username}
          onChange={handleChange}
          placeholder="Tu nombre de usuario"
          disabled={updating}
          error={allErrors.username}
          isDark={isDark}
        />

        <TextField
          id="phone"
          name="phone"
          label="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+593 99 999 9999"
          disabled={updating}
          error={allErrors.phone}
          isDark={isDark}
        />

        <LocationSection
          coords={coords}
          locStatus={locStatus}
          locMsg={locMsg}
          onAskLocation={askLocation}
          updating={updating}
          errors={{ latitude: allErrors.latitude, longitude: allErrors.longitude }}
          isDark={isDark}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={updating || !hasChanges}
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
