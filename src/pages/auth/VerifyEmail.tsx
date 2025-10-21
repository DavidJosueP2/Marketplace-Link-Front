import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import { ApiError } from "@/services/api";

type Status = "loading" | "success" | "already" | "expired" | "invalid" | "error";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = useMemo(() => new URLSearchParams(search).get("token"), [search]);

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const [resendDone, setResendDone] = useState<boolean>(false);

  const hasRequested = useRef<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("Falta el token de verificación.");
      return;
    }
    if (hasRequested.current) return;
    hasRequested.current = true;

    setVerifying(true);
    (async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("Tu cuenta ha sido verificada correctamente.");
      } catch (err) {
        const apiError = err as ApiError;
        const msg =
          apiError?.payload?.data?.message || apiError?.payload?.message || apiError?.message || "No se pudo verificar el correo.";
        const detail = apiError?.payload?.data?.detail || "";
        const merged = (msg + (detail ? " — " + detail : "")).trim();

        if (/ya está activa/i.test(merged)) setStatus("already");
        else if (/expir/i.test(merged)) setStatus("expired");
        else if (/token/i.test(merged)) setStatus("invalid");
        else setStatus("error");

        setMessage(merged);
      } finally {
        setVerifying(false);
      }
    })();
  }, [token]);

  async function handleResend() {
    if (resending || resendDone || !token) return;
    setResending(true);
    try {
      await authService.resendVerification(token);
      setResendDone(true);
      setMessage("Validación de correo reenviada.");
    } catch (err) {
      const apiError = err as ApiError;
      const msg =
        apiError?.payload?.message || apiError?.message || "No se pudo reenviar el correo.";
      toast.error(msg);
      setMessage(msg);
    } finally {
      setResending(false);
    }
  }

  const titleByStatus: Record<Status, string> = {
    loading: "Verificando tu correo…",
    success: "¡Correo verificado!",
    already: "Tu cuenta ya está verificada",
    expired: "El enlace ha expirado",
    invalid: "Token inválido",
    error: "No se pudo verificar tu correo",
  };

  const subtitleByStatus: Record<Status, string> = {
    loading: "Por favor espera un momento.",
    success: "Ya puedes iniciar sesión.",
    already: "Inicia sesión para continuar.",
    expired: "Necesitas un nuevo enlace de verificación.",
    invalid: "El enlace no es válido. Solicita uno nuevo.",
    error: message || "Inténtalo de nuevo más tarde.",
  };

  const action = (() => {
    if (status === "success" || status === "already") {
      return (
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
          disabled={verifying}
        >
          Ir al login
        </button>
      );
    }
    if ((status === "expired" || status === "invalid" || status === "error") && !resendDone) {
      return (
        <button
          onClick={handleResend}
          className="px-4 py-2 rounded-lg border"
          disabled={resending || verifying}
        >
          {resending ? "Enviando..." : "Reenviar verificación"}
        </button>
      );
    }
    return null;
  })();

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="relative flex justify-center items-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-8 py-6 sm:py-8">
        <div
          className="
            relative h-[70vh] sm:h-[72vh]
            w-full sm:w-[92%] lg:w-[70%] xl:w-[60%]
            max-w-4xl
            rounded-2xl overflow-hidden
          "
        >
          <div className="liquid-pill" style={{ "--glass-blur": "16px", "--glass-alpha": 0.3 } as React.CSSProperties} />
          <div className="relative h-full flex flex-col items-center justify-center gap-6 px-6 sm:px-12 md:px-16 text-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                {titleByStatus[status]}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                {subtitleByStatus[status]}
              </p>
              {message && status !== "loading" ? (
                <p className="mt-3 text-sm">{message}</p>
              ) : null}
            </div>

            {status === "loading" ? (
              <div className="animate-pulse h-10 w-40 rounded-lg bg-foreground/10" />
            ) : (
              action
            )}

            {/* ✅ Nuevo bloque: mensaje de reenvío enviado */}
            {resendDone && (status === "expired" || status === "invalid" || status === "error") && (
              <div className="flex flex-col items-center gap-1 mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-600 text-white">
                    ✓
                  </span>
                  <span>Revisa tu buzón. El enlace expira en 24 horas.</span>
                </div>
              </div>
            )}

            {(status === "expired" || status === "invalid") && !resendDone && (
              <div className="text-xs text-muted-foreground">
                ¿No recibiste nada? Revisa tu carpeta de spam.
              </div>
            )}
            {status === "success" && (
              <div className="text-xs">
                ¿Problemas para entrar?{" "}
                <Link to="/login" className="underline">
                  Ir al login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

