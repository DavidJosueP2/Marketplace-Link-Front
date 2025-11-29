import { useState, useMemo, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService, { type RegisterPayload } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import { STEPS, INITIAL_FORM_STATE, type FormState } from "../constants";
import { createValidators, cleanPhone, type Validators } from "../validators";

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

export default function useRegisterForm() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [coords, setCoords] = useState<Coordinates>({ lat: null, lng: null });
  const [locStatus, setLocStatus] = useState<string>("idle");
  const [locMsg, setLocMsg] = useState<string>("");
  const [status, setStatus] = useState<string>("idle");
  const [message, setMessage] = useState<string>("");
  const [showBanner, setShowBanner] = useState<boolean>(false);

  const validators = useMemo<Validators>(() => createValidators(coords, form.password), [coords, form.password]);

  const setFieldError = (name: string, msg: string) => setErrors((e) => ({ ...e, [name]: msg || "" }));

  const validateField = (name: string, value: string): string => {
    const fn = validators[name as keyof Validators];
    if (!fn) return "";
    const msg = typeof fn === "function" ? fn(value) : "";
    setFieldError(name, msg);
    return msg;
  };

  const resetFeedback = () => {
    if (status !== "idle" || showBanner) {
      setStatus("idle");
      setMessage("");
      setShowBanner(false);
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    validateField(name, value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setFieldError(name, "");
    resetFeedback();
  };

  const askLocation = () => {
    setLocStatus("requesting");
    setLocMsg("");
    if (!("geolocation" in navigator)) {
      setLocStatus("error");
      setLocMsg("Tu navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("granted");
        setFieldError("location", "");
      },
      (err) => {
        setLocStatus(err.code === 1 ? "denied" : "error");
        setLocMsg(err.code === 1 ? "Debes permitir la ubicación para registrarte." : "No se pudo obtener tu ubicación.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const findFirstErrorStepIndex = (errs: Record<string, string>): number => {
    let i = 0;
    for (const step of STEPS) {
      for (const f of step.fields) {
        if (errs[f]) return i;
      }
      i += 1;
    }
    return 0;
  };

  const validateStep = (sIndex: number): boolean => {
    const { fields } = STEPS[sIndex];
    const local: Record<string, string> = {};
    for (const f of fields) {
      const val = f === "location" ? "" : form[f as keyof FormState];
      local[f] = f === "location" ? validators.location() : validators[f as keyof Validators]?.(val as string) || "";
    }
    setErrors((e) => ({ ...e, ...local }));
    setTouched((t) => ({ ...t, ...Object.fromEntries(fields.map((f) => [f, true])) }));
    return Object.values(local).every((m) => !m);
  };

  const goNext = () => {
    if (!validateStep(stepIndex)) {
      setStatus("error");
      setMessage("Por favor completa todos los campos correctamente");
      setShowBanner(true);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    setStatus("idle");
    setMessage("");
    setShowBanner(false);
  };

  const goPrev = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    setStatus("idle");
    setMessage("");
    setShowBanner(false);
  };

  const applyBackendErrors = (be: Record<string, any>) => {
    const normalized: Record<string, string> = {};
    for (const [field, msg] of Object.entries(be)) {
      const k = field.startsWith("roles[") || field.startsWith("roles.") ? "roleName" : field;
      normalized[k] = String(msg);
    }
    setErrors((e) => ({ ...e, ...normalized }));
    setTouched((t) => ({ ...t, ...Object.fromEntries(Object.keys(normalized).map((k) => [k, true])) }));
    const sIdx = findFirstErrorStepIndex(normalized);
    setStepIndex(sIdx);
    setStatus("error");
    setMessage("Error de validación en campos");
    setShowBanner(true);
  };

  const collectAllErrors = (): Record<string, string> => {
    const acc: Record<string, string> = {};
    for (const step of STEPS) {
      for (const f of step.fields) {
        const val = f === "location" ? "" : form[f as keyof FormState];
        const err = f === "location" ? validators.location() : validators[f as keyof Validators]?.(val as string) || "";
        if (err) acc[f] = err;
      }
    }
    return acc;
  };

  const markAndFocusErrors = (errs: Record<string, string>) => {
    setErrors((e) => ({ ...e, ...errs }));
    setTouched(Object.fromEntries(Object.keys(errs).map((k) => [k, true])));
    setStepIndex(findFirstErrorStepIndex(errs));
    setStatus("error");
    setMessage("Por favor completa todos los campos correctamente");
    setShowBanner(true);
  };

  const buildPayload = (): RegisterPayload => ({
    username: form.username.trim(),
    email: form.email.trim(),
    password: form.password,
    phone: cleanPhone(form.phone),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    cedula: form.cedula.trim(),
    gender: form.gender,
    roles: [{ roleName: form.roleName }],
    latitude: coords.lat!,
    longitude: coords.lng!,
  });

  const handleSubmit = async () => {
    const allErrors = collectAllErrors();
    if (Object.keys(allErrors).length) {
      markAndFocusErrors(allErrors);
      return;
    }

    const payload = buildPayload();

    try {
      setSubmitting(true);
      const data = await authService.register(payload);
      setStatus("success");
      setMessage("Cuenta creada, verifica tu correo.");
      setShowBanner(true);
      toast.success("Cuenta creada, verifica tu correo.");
      navigate("/login?registered=1&email=" + encodeURIComponent(data?.email || form.email), { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      const details = apiError?.payload?.data || {};
      const be = details?.errors || apiError?.payload?.data?.errors || null;
      if (be && typeof be === "object") {
        applyBackendErrors(be);
      } else {
        setStatus("error");
        setMessage(apiError?.payload?.message || apiError?.message || "No se pudo completar el registro.");
        setShowBanner(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    stepIndex,
    form,
    touched,
    errors,
    submitting,
    coords,
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
    validateStep,
    resetFeedback,
  };
}
