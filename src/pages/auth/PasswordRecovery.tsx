import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import { ApiError } from "@/services/api";

export default function PasswordRecovery() {
  const [email, setEmail] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const validateEmail = (v: string): string => {
    if (!v) return "Requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email no válido.";
    return "";
  };

  const onBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touched) setError(validateEmail(e.target.value));
    if (error) setError("");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const local = validateEmail(email);
    setTouched(true);
    if (local) {
      setError(local);
      return;
    }
    try {
      setSubmitting(true);
      await authService.forgotPassword(email);
      toast.success("Te enviamos un enlace para restablecer tu contraseña.");
      setEmail("");
      setTouched(false);
      setError("");
    } catch (err) {
      const apiError = err as ApiError;
      const msg =
        apiError?.payload?.message ||
        apiError?.message ||
        "No se pudo enviar el enlace de recuperación.";
      setError(msg);
      toast.error("No se pudo enviar el enlace.");
    } finally {
      setSubmitting(false);
    }
  };

  const hasError = touched && !!error;

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="relative flex justify-center items-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-8 py-6 sm:py-8">
        <div className="relative h-[70vh] sm:h-[72vh] w-full sm:w-[92%] lg:w-[70%] xl:w-[60%] max-w-4xl rounded-2xl overflow-hidden">
          <div className="liquid-pill" style={{ "--glass-blur": "8px", "--glass-alpha": 0.3 } as React.CSSProperties} />
          <div className="relative h-full flex flex-col items-center justify-center gap-6 px-6 sm:px-12 md:px-16 text-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Recuperar contraseña</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Ingresa el correo de tu cuenta y te enviaremos un enlace para restablecerla.
              </p>
            </div>

            <form onSubmit={onSubmit} className="w-full max-w-md text-left grid gap-3" noValidate>
              <label htmlFor="email" className="text-sm">Correo</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                onBlur={onBlur}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="tucorreo@dominio.com"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={hasError}
                aria-describedby={hasError ? "email-error" : undefined}
              />

              {hasError && (
                <p id="email-error" className="text-xs text-red-600" role="alert" aria-live="polite">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                aria-busy={submitting}
              >
                {submitting ? "Enviando…" : "Enviar enlace"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                ¿Recordaste tu contraseña?{" "}
                <a href="/login" className="underline underline-offset-4">Ingresa aquí</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
