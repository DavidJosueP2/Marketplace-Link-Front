import { useEffect, useMemo, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import authService from "@/services/auth.service";
import { ApiError } from "@/services/api";

type Status = "idle" | "submitting" | "success" | "error" | "invalid" | "expired";

/* ───────── helpers ───────── */

const validatePwd = (v: string): string => {
  if (!v) return "Requerido.";
  if (v.length < 8) return "Mínimo 8 caracteres.";
  if (!/[A-Z]/.test(v)) return "Debe incluir al menos una mayúscula.";
  if (!/[a-z]/.test(v)) return "Debe incluir al menos una minúscula.";
  if (!/\d/.test(v)) return "Debe incluir al menos un número.";
  if (!/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(v)) return "Debe incluir al menos un carácter especial.";
  return "";
};

const buildMergedMessage = (base: string, detail?: string): string =>
  [base, detail?.trim()].filter(Boolean).join(" — ").replace(/— Bad Request/gi, "").trim();

const classifyStatus = (msg: string): Status => {
  if (/expir/i.test(msg)) return "expired";
  if (/token/i.test(msg) || /inválid/i.test(msg)) return "invalid";
  return "error";
};

const pwd2Validator = (touched: boolean, pwd2: string, pwd: string): string => {
  if (!touched) return "";
  if (!pwd2) return "Requerido.";
  if (pwd !== pwd2) return "Las contraseñas no coinciden.";
  return "";
};

/* ───────── UI piezas pequeñas (fuera del componente, evita S6478) ───────── */

interface ActionProps { status: Status; onGoLogin: () => void; }
function Action({ status, onGoLogin }: Readonly<ActionProps>) {
  if (status === "success") {
    return <Button onClick={onGoLogin} className="w-full">Ir al login</Button>;
  }
  return (
    <Button type="submit" disabled={status === "submitting"} className="w-full">
      {status === "submitting" ? "Actualizando…" : "Actualizar contraseña"}
    </Button>
  );
}

interface FeedbackProps { status: Status; message: string; }
function Feedback({ status, message }: Readonly<FeedbackProps>) {
  if (!message) return null;
  const isSuccess = status === "success";
  const isError = status === "invalid" || status === "expired" || status === "error";

  let containerVariant = "text-muted-foreground";
  if (isSuccess) containerVariant = "bg-green-100/40 text-green-700 dark:bg-green-900/20 dark:text-green-400";
  else if (isError) containerVariant = "bg-red-100/40 text-red-700 dark:bg-red-900/20 dark:text-red-400";

  let dotBg = "bg-gray-400", symbol = "•";
  if (isSuccess) { dotBg = "bg-green-600"; symbol = "✓"; }
  else if (isError) { dotBg = "bg-red-600"; symbol = "✕"; }

  return (
    <div className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg ${containerVariant}`}>
      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-white ${dotBg}`}>{symbol}</span>
      <span>{message}</span>
    </div>
  );
}

/* Campo de contraseña reutilizable con “reveal” interno */
interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  disabled?: boolean;
  hint?: string;
  error?: string;
}
function PasswordField({
                         id, name, label, value, onChange, onBlur, disabled, hint, error,
                       }: Readonly<PasswordFieldProps>) {
  const [reveal, setReveal] = useState(false);
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative rounded-lg transition focus-within:ring-2 focus-within:ring-primary/45 focus-within:bg-foreground/5">
        <Input
          id={id}
          name={name}
          type={reveal ? "text" : "password"}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="new-password"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          disabled={disabled}
          className="pr-10 placeholder:opacity-60 placeholder:tracking-wide"
        />
        <button
          type="button"
          aria-label={reveal ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setReveal((v) => !v)}
          className="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-8 rounded-md hover:bg-foreground/5"
          tabIndex={-1}
        >
          {reveal ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}

        </button>
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

/* ───────── Componente principal (simplificado) ───────── */

export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = useMemo(() => new URLSearchParams(search).get("token"), [search]);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [touched, setTouched] = useState(false);
  const firstRun = useRef(true);

  const pwdError = useMemo(() => (touched ? validatePwd(pwd) : ""), [touched, pwd]);
  const pwd2Error = useMemo(() => pwd2Validator(touched, pwd2, pwd), [touched, pwd2, pwd]);

  useEffect(() => {
    if (!firstRun.current) return;
    firstRun.current = false;
    if (!token) {
      setStatus("invalid");
      setMessage("Falta el token o es inválido.");
    }
    setPwd("");
    setPwd2("");
  }, [token]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);

    if (validatePwd(pwd) || pwd2Validator(true, pwd2, pwd)) return;
    if (!token) return;

    try {
      setStatus("submitting");
      await authService.resetPassword({ token, newPassword: pwd });
      setStatus("success");
      setMessage("Tu contraseña ha sido actualizada correctamente.");
    } catch (err) {
      const apiError = err as ApiError;
      const base = apiError?.payload?.message || apiError?.message || "No se pudo restablecer la contraseña.";
      const detail = apiError?.payload?.data?.detail || apiError?.payload?.data?.error || "";
      const merged = buildMergedMessage(base, detail);
      setStatus(classifyStatus(merged));
      setMessage(merged);
    }
  };

  const onGoLogin = () => navigate("/login", { replace: true });

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-8">
        <div className="relative h-[70vh] sm:h-[72vh] w-full sm:w-[92%] lg:w-[70%] xl:w-[60%] max-w-4xl rounded-2xl overflow-hidden">
          <div className="liquid-pill" style={{ "--glass-blur": "16px", "--glass-alpha": 0.3 } as React.CSSProperties} />
          <div className="relative h-full flex flex-col items-center justify-center gap-6 px-6 sm:px-12 md:px-16 text-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Restablecer contraseña</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">Crea una nueva contraseña para tu cuenta.</p>
              <Feedback status={status} message={message} />
            </div>

            {status !== "success" ? (
              <form onSubmit={onSubmit} autoComplete="off" className="w-full max-w-md md:max-w-lg text-left grid gap-5">
                {/* honeypots */}
                <input type="text" name="username" autoComplete="username" tabIndex={-1} aria-hidden="true"
                       style={{ position: "absolute", left: "-9999px", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />
                <input type="password" name="password" autoComplete="new-password" tabIndex={-1} aria-hidden="true"
                       style={{ position: "absolute", left: "-9999px", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />

                <PasswordField
                  id="pwd"
                  name="new_password"
                  label="Nueva contraseña"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onBlur={() => setTouched(true)}
                  disabled={status === "submitting"}
                  hint="Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
                  error={pwdError}
                />

                <PasswordField
                  id="pwd2"
                  name="new_password_confirm"
                  label="Confirmar contraseña"
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  onBlur={() => setTouched(true)}
                  disabled={status === "submitting"}
                  error={pwd2Error}
                />

                <Action status={status} onGoLogin={onGoLogin} />

                <p className="text-xs text-muted-foreground text-center">
                  ¿Recordaste tu contraseña? <Link to="/login" className="underline underline-offset-4">Ingresa aquí</Link>
                </p>
              </form>
            ) : (
              <div className="w-full max-w-md md:max-w-lg grid gap-5">
                <Action status={status} onGoLogin={onGoLogin} />
                <p className="text-xs text-muted-foreground text-center">Siempre atentos a tu comodidad.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
