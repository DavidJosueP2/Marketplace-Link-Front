import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAccessToken } from "@/auth/tokenStorage";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { STEPS } from "./register/constants";
import useRegisterForm from "./register/hooks/useRegisterForm";
import Feedback from "./register/components/Feedback";
import StepIndicator from "./register/components/StepIndicator";
import StepAccount from "./register/components/StepAccount.jsx";
import StepProfile from "./register/components/StepProfile.jsx";
import StepLocation from "./register/components/StepLocation.jsx";

export default function Register() {
  const navigate = useNavigate();
  const [reveal1, setReveal1] = useState(false);
  const [reveal2, setReveal2] = useState(false);

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

  const onFormSubmit = (e) => {
    e.preventDefault();

    if (!isLastStep) {
      goNext();
      return;
    }

    handleSubmit();
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="relative flex justify-center items-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-8 py-6 sm:py-8">
        <div className="relative h-[86vh] sm:h-[88vh] w-full sm:w={[96%]} lg:w-[86%] xl:w-[72%] max-w-4xl rounded-2xl overflow-hidden">
          <div className="liquid-pill" style={{ "--glass-blur": "8px", "--glass-alpha": 0.3 }} />
          <div className="relative h-full flex flex-col items-center justify-center gap-6 px-6 sm:px-10 md:px-14 text-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Crear una cuenta.</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Regístrate para comprar o vender. Debes compartir tu ubicación.
              </p>
            </div>

            <Card className="w-full max-w-3xl border border-[color-mix(in_oklab,var(--border),transparent_0%)]/70 bg-[color-mix(in_oklab,var(--card),transparent_6%)]/90 backdrop-blur text-left">
              <CardContent className="p-6 sm:p-8">
                <Feedback showBanner={showBanner} message={message} status={status} />
                <StepIndicator currentStepIndex={stepIndex} />

                <form className="grid gap-6" onSubmit={onFormSubmit} autoComplete="on">
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

                  <div className="flex items-center justify-between gap-3">
                    <Button type="button" variant="outline" onClick={goPrev} disabled={stepIndex === 0}>
                      Atrás
                    </Button>
                    {isLastStep ? (
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Creando cuenta…" : "Registrarme"}
                      </Button>
                    ) : (
                      <Button type="submit">
                        Siguiente
                      </Button>
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
