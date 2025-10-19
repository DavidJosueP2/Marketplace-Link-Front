import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import authService from "@/services/auth.service";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = useMemo(() => new URLSearchParams(search).get("token"), [search]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [reveal1, setReveal1] = useState(false);
  const [reveal2, setReveal2] = useState(false);
  const [touched, setTouched] = useState(false);
  const firstRun = useRef(true);

  const validatePwd = (v) => {
    if (!v) return "Requerido.";
    if (v.length < 8) return "Mínimo 8 caracteres.";
    if (!/[A-Z]/.test(v)) return "Debe incluir al menos una mayúscula.";
    if (!/[a-z]/.test(v)) return "Debe incluir al menos una minúscula.";
    if (!/[0-9]/.test(v)) return "Debe incluir al menos un número.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(v)) return "Debe incluir al menos un carácter especial.";
    return "";
  };

  const pwdError = touched ? validatePwd(pwd) : "";
  const pwd2Error = touched ? (!pwd2 ? "Requerido." : pwd !== pwd2 ? "Las contraseñas no coinciden." : "") : "";

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      if (!token) {
        setStatus("invalid");
        setMessage("Falta el token o es inválido.");
      }
      setPwd("");
      setPwd2("");
    }
  }, [token]);

  async function onSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (validatePwd(pwd) || !pwd2 || pwd !== pwd2) return;
    try {
      setStatus("submitting");
      await authService.resetPassword({ token, newPassword: pwd });
      setStatus("success");
      setMessage("Tu contraseña ha sido actualizada correctamente.");
    } catch (err) {
      const base = err?.data?.message || err?.message || "No se pudo restablecer la contraseña.";
      const detail = err?.data?.detail || err?.data?.error || "";
      let merged = `${base}${detail ? ` — ${detail}` : ""}`.trim();
      merged = merged.replace(/— Bad Request/gi, "").trim();
      if (/expir/i.test(merged)) setStatus("expired");
      else if (/token/i.test(merged) || /inválid/i.test(merged)) setStatus("invalid");
      else setStatus("error");
      setMessage(merged);
    }
  }

  const Action = () => {
    if (status === "success") {
      return (
        <Button onClick={() => navigate("/login", { replace: true })} className="w-full">
          Ir al login
        </Button>
      );
    }
    return (
      <Button type="submit" disabled={status === "submitting"} className="w-full">
        {status === "submitting" ? "Actualizando…" : "Actualizar contraseña"}
      </Button>
    );
  };

  const Feedback = () => {
    if (!message) return null;
    const isSuccess = status === "success";
    const isError = status === "invalid" || status === "expired" || status === "error";
    return (
      <div
        className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg ${
          isSuccess
            ? "bg-green-100/40 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            : isError
              ? "bg-red-100/40 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              : "text-muted-foreground"
        }`}
      >
        <span
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-white ${
            isSuccess ? "bg-green-600" : isError ? "bg-red-600" : "bg-gray-400"
          }`}
        >
          {isSuccess ? "✓" : isError ? "✕" : "•"}
        </span>
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="relative flex justify-center items-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-8 py-6 sm:py-8">
        <div className="relative h-[70vh] sm:h-[72vh] w-full sm:w-[92%] lg:w-[70%] xl:w-[60%] max-w-4xl rounded-2xl overflow-hidden">
          <div className="liquid-pill" style={{ "--glass-blur": "8px", "--glass-alpha": 0.3 }} />
          <div className="relative h-full flex flex-col items-center justify-center gap-6 px-6 sm:px-12 md:px-16 text-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Restablecer contraseña</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">Crea una nueva contraseña para tu cuenta.</p>
              <Feedback />
            </div>
            {status !== "success" ? (
              <form onSubmit={onSubmit} autoComplete="off" className="w-full max-w-md md:max-w-lg text-left grid gap-5">
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                />
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                />
                <div className="grid gap-2">
                  <Label htmlFor="pwd">Nueva contraseña</Label>
                  <div className="relative rounded-lg transition focus-within:ring-2 focus-within:ring-primary/45 focus-within:bg-foreground/5">
                    <Input
                      id="pwd"
                      name="new_password"
                      type={reveal1 ? "text" : "password"}
                      placeholder="••••••••"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      onBlur={() => setTouched(true)}
                      autoComplete="new-password"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="text"
                      disabled={status === "submitting"}
                      className="pr-10 placeholder:opacity-60 placeholder:tracking-wide"
                    />
                    <button
                      type="button"
                      aria-label={reveal1 ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setReveal1((v) => !v)}
                      className="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-8 rounded-md hover:bg-foreground/5"
                      tabIndex={-1}
                    >
                      {reveal1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                  </p>
                  {pwdError && <p className="text-xs text-destructive mt-1">{pwdError}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pwd2">Confirmar contraseña</Label>
                  <div className="relative rounded-lg transition focus-within:ring-2 focus-within:ring-primary/45 focus-within:bg-foreground/5">
                    <Input
                      id="pwd2"
                      name="new_password_confirm"
                      type={reveal2 ? "text" : "password"}
                      placeholder="••••••••"
                      value={pwd2}
                      onChange={(e) => setPwd2(e.target.value)}
                      onBlur={() => setTouched(true)}
                      autoComplete="new-password"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="text"
                      disabled={status === "submitting"}
                      className="pr-10 placeholder:opacity-60 placeholder:tracking-wide"
                    />
                    <button
                      type="button"
                      aria-label={reveal2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setReveal2((v) => !v)}
                      className="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-8 rounded-md hover:bg-foreground/5"
                      tabIndex={-1}
                    >
                      {reveal2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {pwd2Error && <p className="text-xs text-destructive">{pwd2Error}</p>}
                </div>
                <Action />
                <p className="text-xs text-muted-foreground text-center">
                  ¿Recordaste tu contraseña? <Link to="/login" className="underline underline-offset-4">Ingresa aquí</Link>
                </p>
              </form>
            ) : (
              <div className="w-full max-w-md md:max-w-lg grid gap-5">
                <Action />
                <p className="text-xs text-muted-foreground text-center">Siempre atentos a tu comodidad.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
