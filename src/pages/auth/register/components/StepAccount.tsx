import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { formatPhone } from "../validators";
import type { FormState } from "../constants";

interface StepAccountProps {
  form: FormState;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  reveal1: boolean;
  reveal2: boolean;
  setReveal1: Dispatch<SetStateAction<boolean>>;
  setReveal2: Dispatch<SetStateAction<boolean>>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  setForm: Dispatch<SetStateAction<FormState>>;
  setFieldError: (name: string, msg: string) => void;
  resetFeedback: () => void;
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

export default function StepAccount({
  form,
  errors,
  touched,
  reveal1,
  reveal2,
  setReveal1,
  setReveal2,
  handleChange,
  handleBlur,
  setForm,
  setFieldError,
  resetFeedback,
}: Readonly<StepAccountProps>) {
  return (
    <div className="grid gap-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1 block">Usuario</Label>
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="p.ej. dvalencia_92"
          />
          {touched.username && errors.username && (
            <p className="text-xs text-red-600 mt-1">{errors.username}</p>
          )}
        </div>
        <div>
          <Label className="mb-1 block">Correo</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="tucorreo@dominio.com"
            autoComplete="email"
          />
          {touched.email && errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password" className="mb-1 flex items-center justify-between">
            <span>Contraseña</span>
            <button
              type="button"
              onClick={() => setReveal1((v) => !v)}
              aria-controls="password"
              aria-label={reveal1 ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-foreground/5"
            >
              {reveal1 ? <EyeOff /> : <Eye />}
            </button>
          </Label>
          <Input
            id="password"
            type={reveal1 ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
          {touched.password && errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-1 flex items-center justify-between">
            <span>Confirmar contraseña</span>
            <button
              type="button"
              onClick={() => setReveal2((v) => !v)}
              aria-controls="confirmPassword"
              aria-label={reveal2 ? "Ocultar confirmación" : "Mostrar confirmación"}
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-foreground/5"
            >
              {reveal2 ? <EyeOff /> : <Eye />}
            </button>
          </Label>
          <Input
            id="confirmPassword"
            type={reveal2 ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="mb-1 block">Teléfono</Label>
        <div className="flex">
          <span
            className="select-none inline-flex items-center justify-center rounded-l-md border border-r-0 px-3 text-sm bg-[color-mix(in_oklab,var(--card),white_8%)] text-muted-foreground"
            style={{
              borderColor: "color-mix(in oklab, var(--border), transparent 0%)",
            }}
          >
            +593
          </span>
          <Input
            name="phone"
            value={form.phone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setForm((f) => ({ ...f, phone: formatted }));
              if (errors.phone) setFieldError("phone", "");
              resetFeedback();
            }}
            onBlur={handleBlur}
            className="rounded-l-none"
            placeholder="998 657 051"
            inputMode="numeric"
          />
        </div>
        {touched.phone && errors.phone && (
          <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
}
