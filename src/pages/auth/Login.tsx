import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth.js";

import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/shadcn/card";
import { Eye, EyeOff } from "lucide-react"; // 👈 íconos ojo

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = useMemo(
    () => location.state?.from?.pathname || "/",
    [location.state],
  );

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

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
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* imagen de fondo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/rings-bg.jpg')" }}
      />

      {/* contenedor principal */}
      <div className="relative flex justify-start items-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-8 py-6 sm:py-8">
        {/* Panel glass: IZQUIERDA ~mitad del viewport */}
        <div
          className="
            relative h-[86vh] sm:h-[88vh]
            w-full sm:w-[92%] lg:w-1/2 xl:w-[54%]
            rounded-2xl overflow-hidden
          "
        >
          <div
            className="liquid-pill"
            style={{ "--glass-blur": "8px", "--glass-alpha": 0.3 }}
          />

          {/* contenido del panel (centrado) */}
          <div className="relative h-full flex flex-col items-center justify-center gap-8 sm:gap-10 px-6 sm:px-12 md:px-16 text-center">
            {/* Títulos */}
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Bienvenido de vuelta.
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Cuidamos la calidad de atención y la selección de productos para
                una experiencia de marketplace confiable.
              </p>
            </div>

            {/* Form adaptable con mayor padding horizontal */}
            <Card
              className="
                w-full
                max-w-md md:max-w-lg
                border border-[color-mix(in_oklab,var(--border),transparent_0%)]/70
                bg-[color-mix(in_oklab,var(--card),transparent_6%)]/90
                backdrop-blur
              "
            >
              <CardHeader className="pb-2">
                <CardTitle>Iniciar sesión</CardTitle>
                <CardDescription>Usa tu correo y contraseña</CardDescription>
              </CardHeader>

              <CardContent className="px-6 sm:px-8">
                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    {/* Label izquierda + link derecha en la misma fila */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link
                        to="/password-recovery"
                        className="text-brand text-xs underline underline-offset-4 hover:opacity-90"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    {/* Input con botón/ícono para ver contraseña */}
                    <div className="relative">
                      <Input
                        id="password"
                        type={reveal ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="pr-10" // espacio para el botón del ojo
                      />
                      <button
                        type="button"
                        aria-label={
                          reveal ? "Ocultar contraseña" : "Mostrar contraseña"
                        }
                        onClick={() => setReveal((v) => !v)}
                        className="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-8 rounded-md hover:bg-foreground/5"
                      >
                        {reveal ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMsg ? (
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-left">
                      {errorMsg}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? "Ingresando..." : "Entrar"}
                  </Button>

                  {/* No tienes cuenta + Regístrate */}
                  <div className="text-center text-xs">
                    <span className="text-foreground">
                      ¿No tienes una cuenta?{" "}
                    </span>
                    <Link
                      to="/register"
                      className="text-brand underline underline-offset-4 hover:opacity-90"
                    >
                      Regístrate
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer global en la página (no en el panel) */}
      <footer className="pointer-events-none fixed right-4 bottom-3 text-[11px] sm:text-xs text-muted-foreground/90">
        © Marketplace Link. Derechos reservados
      </footer>
    </div>
  );
}
