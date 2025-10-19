import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.js";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = useMemo(() => location.state?.from?.pathname || "/", [location.state]);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const Feedback = ({ message }) => {
    if (!message) return null;
    return (
      <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive">
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white bg-destructive">✕</span>
        <span>{message}</span>
      </div>
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    const { success, errorData } = await login(email, password);
    setSubmitting(false);
    if (success) {
      navigate(from, { replace: true });
    } else {
      const msg =
        errorData?.message ||
        errorData?.details ||
        "Credenciales inválidas. Intenta nuevamente.";
      setErrorMsg(String(msg));
    }
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      <div className="relative flex items-center justify-center min-h-[100dvh] px-4 sm:px-8 py-6 sm:py-8">
        <div className="relative h-[70vh] sm:h-[72vh] w-full sm:w-[92%] lg:w-[70%] xl:w-[60%] max-w-4xl rounded-2xl overflow-hidden">
          <div className="liquid-pill" style={{ "--glass-blur": "8px", "--glass-alpha": 0.3 }} />
          <div className="relative h-full flex flex-col items-center justify-center gap-10 px-6 sm:px-12 md:px-16 text-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Bienvenido de vuelta.</h1>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-muted-foreground">
                Cuidamos la calidad de atención y la selección de productos para una experiencia de marketplace confiable.
              </p>
            </div>
            <form
              className="w-full max-w-md md:max-w-lg text-left grid gap-5"
              onSubmit={handleSubmit}
              autoComplete="on"
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  className="placeholder:opacity-60 placeholder:tracking-wide"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    to="/password-recovery"
                    className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div className="relative rounded-lg transition focus-within:ring-2 focus-within:ring-primary/45 focus-within:bg-foreground/5">
                  <Input
                    id="password"
                    type={reveal ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="pr-10 placeholder:opacity-60 placeholder:tracking-wide"
                  />
                  <button
                    type="button"
                    aria-label={reveal ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setReveal((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-8 rounded-md hover:bg-foreground/5"
                  >
                    {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Feedback message={errorMsg} />

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Ingresando..." : "Entrar"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                <span className="text-foreground">¿No tienes una cuenta? </span>
                <Link
                  to="/register"
                  className="underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Regístrate
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
