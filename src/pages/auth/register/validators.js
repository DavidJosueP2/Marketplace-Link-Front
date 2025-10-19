export const formatPhone = (v) => {
  const d = (v || "").replace(/\D/g, "").slice(0, 9);
  const parts = [];
  for (let i = 0; i < d.length; i += 3) parts.push(d.slice(i, i + 3));
  return parts.join(" ");
};

export const cleanPhone = (v) => {
  const d = (v || "").replace(/\D/g, "").slice(0, 9);
  return d ? `0${d}` : "";
};

export const createValidators = (coords, password) => ({
  username: (v) => {
    if (!v || v.trim().length < 3) return "Mínimo 3 caracteres.";
    if (v.trim().length > 50) return "Máximo 50.";
    return "";
  },

  email: (v) => {
    if (!v) return "Requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email no válido.";
    if (v.length > 255) return "Máximo 255.";
    return "";
  },

  password: (v) => {
    if (!v) return "Requerido.";
    if (v.length < 8) return "Mínimo 8 caracteres.";
    if (!/[A-Z]/.test(v)) return "Debe incluir al menos una mayúscula.";
    if (!/[a-z]/.test(v)) return "Debe incluir al menos una minúscula.";
    if (!/\d/.test(v)) return "Debe incluir al menos un número.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(v))
      return "Debe incluir al menos un carácter especial.";
    return "";
  },

  confirmPassword: (v) => {
    if (!v) return "Confirma tu contraseña.";
    if (v !== password) return "No coincide.";
    return "";
  },

  phone: (v) => {
    const digits = (v || "").replace(/\D/g, "");
    if (!digits) return "Requerido.";
    if (digits.length !== 9) return "Debe tener 9 dígitos.";
    return "";
  },

  firstName: (v) => {
    if (!v) return "Requerido.";
    if (v.length > 100) return "Máximo 100.";
    return "";
  },

  lastName: (v) => {
    if (!v) return "Requerido.";
    if (v.length > 100) return "Máximo 100.";
    return "";
  },

  cedula: (v) => {
    if (!v) return "Requerido.";
    if (!/^\d{10}$/.test(v)) return "10 dígitos.";
    return "";
  },

  gender: (v) => {
    if (!v) return "Selecciona tu género.";
    return "";
  },

  roleName: (v) => {
    if (!v) return "Selecciona rol.";
    return "";
  },

  location: () => {
    if (coords.lat === null || coords.lng === null)
      return "Ubicación obligatoria.";
    return "";
  },
});
