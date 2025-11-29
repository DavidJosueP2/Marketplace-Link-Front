import { useEffect, useState, type FormEvent, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAccessToken } from "@/auth/tokenStorage";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { STEPS } from "./register/constants";
import useRegisterForm from "./register/hooks/useRegisterForm";
import Feedback from "./register/components/Feedback";
import StepIndicator from "./register/components/StepIndicator";

const StepAccount = lazy(() => import("./register/components/StepAccount"));
const StepProfile = lazy(() => import("./register/components/StepProfile"));
const StepLocation = lazy(() => import("./register/components/StepLocation"));

export default function Register() {
  const navigate = useNavigate();
  const [reveal1, setReveal1] = useState<boolean>(false);
  const [reveal2, setReveal2] = useState<boolean>(false);

  const {
    stepIndex,
    form,
    touched,
    errors,
    submitting,
    locStatus,
    locMsg,
    status,
    message,
    showBanner,
    setForm,
    setFieldError,
    handleBlur,
    handleChange,
    askLocation,
    goNext,
    goPrev,
    handleSubmit,
    resetFeedback,
  } = useRegisterForm();

  useEffect(() => {
    if (getAccessToken()) navigate("/", { replace: true });
  }, [navigate]);

  const currentStepKey = STEPS[stepIndex].key;
  const isLastStep = stepIndex === STEPS.length - 1;

  useEffect(() => {
    const idle = (cb: () => void) =>
      "requestIdleCallback" in window
        ? (window as any).requestIdleCallback(cb)
        : setTimeout(cb, 200);
    if (currentStepKey === "cuenta") idle(() => import("./register/components/StepProfile"));
    if (currentStepKey === "perfil") idle(() => import("./register/components/StepLocation"));
  }, [currentStepKey]);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLastStep) {
      goNext();
      return;
    }
    handleSubmit();
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-8">
        <div className="relative h-[86vh] sm:h-[88vh] w-full sm:w-[96%] lg:w-[86%] xl:w-[72%] max-w-4xl rounded-2xl overflow-hidden">
          <div className="liquid-pill" style={{ "--glass-blur": "16px", "--glass-alpha": 0.3 } as React.CSSProperties} />
          <div className="relative h-full flex flex-col items-center justify-center gap-6 px-6 sm:px-10 md:px-14 text-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Crear una cuenta.</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Regístrate para comprar o vender. Debes compartir tu ubicación.
              </p>
            </div>

            <Card className="w-full max-w-3xl rounded-2xl bg-card/95 backdrop-blur-md border border-border/60 shadow-md transition-colors dark:bg-card/85 dark:border-white/25 dark:shadow-[0_10px_40px_-18px_rgba(0,0,0,0.85)] hover:border-border/80 dark:hover:border-white/40">
            <CardContent className="p-6 sm:p-8">
                <Feedback showBanner={showBanner} message={message} status={status} />
                <StepIndicator currentStepIndex={stepIndex} />

                <form className="grid gap-6" onSubmit={onFormSubmit} autoComplete="on">
                  <Suspense fallback={<div className="p-6 text-sm">Cargando sección…</div>}>
                    {currentStepKey === "cuenta" && (
                      <StepAccount
                        form={form}
                        errors={errors}
                        touched={touched}
                        reveal1={reveal1}
                        reveal2={reveal2}
                        setReveal1={setReveal1}
                        setReveal2={setReveal2}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setForm={setForm}
                        setFieldError={setFieldError}
                        resetFeedback={resetFeedback}
                      />
                    )}

                    {currentStepKey === "perfil" && (
                      <StepProfile
                        form={form}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setForm={setForm}
                      />
                    )}

                    {currentStepKey === "ubicacion" && (
                      <StepLocation
                        locStatus={locStatus}
                        locMsg={locMsg}
                        errors={errors}
                        touched={touched}
                        askLocation={askLocation}
                      />
                    )}
                  </Suspense>

                  <div className="flex items-center justify-between gap-3">
                    <Button type="button" variant="outline" onClick={goPrev} disabled={stepIndex === 0}>
                      Atrás
                    </Button>
                    {isLastStep ? (
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Creando cuenta…" : "Registrarme"}
                      </Button>
                    ) : (
                      <Button type="submit">Siguiente</Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-center mt-1">
              <span className="text-foreground">¿Ya tienes cuenta? </span>
              <Link
                to="/login"
                className="underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
