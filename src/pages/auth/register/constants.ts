export interface GenderOption {
  value: string;
  label: string;
}

export interface RoleOption {
  value: string;
  label: string;
}

export interface Step {
  key: string;
  label: string;
  fields: string[];
}

export const GENDERS: GenderOption[] = [
  { value: "MALE", label: "Masculino" },
  { value: "FEMALE", label: "Femenino" },
  { value: "OTHER", label: "Otro / Prefiero no decir" },
];

export const ROLES: RoleOption[] = [
  { value: "ROLE_BUYER", label: "Comprador" },
  { value: "ROLE_SELLER", label: "Vendedor" },
];

export const STEPS: Step[] = [
  { key: "cuenta", label: "Cuenta", fields: ["username", "email", "password", "confirmPassword", "phone"] },
  { key: "perfil", label: "Perfil", fields: ["firstName", "lastName", "cedula", "gender", "roleName"] },
  { key: "ubicacion", label: "Ubicación", fields: ["location"] },
];

export interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  firstName: string;
  lastName: string;
  cedula: string;
  gender: string;
  roleName: string;
}

export const INITIAL_FORM_STATE: FormState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  firstName: "",
  lastName: "",
  cedula: "",
  gender: "",
  roleName: "ROLE_BUYER",
};

