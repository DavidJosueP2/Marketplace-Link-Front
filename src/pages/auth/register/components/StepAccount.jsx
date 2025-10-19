import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { formatPhone } from "../validators";

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
  resetFeedback
}) {
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
          {touched.username && errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
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
          {touched.email && errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
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
              {reveal1 ? <EyeOff size={18} /> : <Eye size={18} />}
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
          {touched.password && errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
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
              {reveal2 ? <EyeOff size={18} /> : <Eye size={18} />}
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
          {touched.confirmPassword && errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div>
        <Label className="mb-1 block">Teléfono</Label>
        <div className="flex">
          <span
            className="select-none inline-flex items-center justify-center rounded-l-md border border-r-0 px-3 text-sm bg-[color-mix(in_oklab,var(--card),white_8%)] text-muted-foreground"
            style={{ borderColor: "color-mix(in oklab, var(--border), transparent 0%)" }}
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
        {touched.phone && errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
      </div>
    </div>
  );
}

