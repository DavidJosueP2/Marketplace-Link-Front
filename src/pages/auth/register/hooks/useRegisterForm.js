import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import { STEPS, INITIAL_FORM_STATE } from "../constants";
import { createValidators, cleanPhone } from "../validators";

export default function useRegisterForm() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locStatus, setLocStatus] = useState("idle");
  const [locMsg, setLocMsg] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  const validators = useMemo(
    () => createValidators(coords, form.password),
    [coords, form.password]
  );

  const setFieldError = (name, msg) => setErrors((e) => ({ ...e, [name]: msg || "" }));

  const validateField = (name, value) => {
    const fn = validators[name];
    if (!fn) return "";
    const msg = fn(value);
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    validateField(name, value);
  };

  const handleChange = (e) => {
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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const findFirstErrorStepIndex = (errs) => {
    let i = 0;
    for (const step of STEPS) {
      for (const f of step.fields) {
        if (errs[f]) return i;
      }
      i += 1;
    }
    return 0;
  };

  const validateStep = (sIndex) => {
    const { fields } = STEPS[sIndex];
    const local = {};
    for (const f of fields) {
      const val = f === "location" ? null : form[f];
      local[f] = f === "location" ? validators.location() : validators[f]?.(val) || "";
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

  const applyBackendErrors = (be) => {
    const normalized = {};
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

  const handleSubmit = async () => {
    let allValid = true;
    const allErrors = {};

    for (const step of STEPS) {
      for (const f of step.fields) {
        const val = f === "location" ? null : form[f];
        const error = f === "location" ? validators.location() : validators[f]?.(val) || "";
        if (error) {
          allErrors[f] = error;
          allValid = false;
        }
      }
    }

    if (!allValid) {
      setErrors((e) => ({ ...e, ...allErrors }));
      setTouched(Object.fromEntries(Object.keys(allErrors).map((k) => [k, true])));
      const sIdx = findFirstErrorStepIndex(allErrors);
      setStepIndex(sIdx);
      setStatus("error");
      setMessage("Por favor completa todos los campos correctamente");
      setShowBanner(true);
      return;
    }

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: cleanPhone(form.phone),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      cedula: form.cedula.trim(),
      gender: form.gender,
      roles: [{ roleName: form.roleName }],
      latitude: coords.lat,
      longitude: coords.lng,
    };

    try {
      setSubmitting(true);
      const data = await authService.register(payload);
      setStatus("success");
      setMessage("Cuenta creada, verifica tu correo.");
      setShowBanner(true);
      toast.success("Cuenta creada, verifica tu correo.");
      navigate("/login?registered=1&email=" + encodeURIComponent(data?.email || form.email), { replace: true });
    } catch (err) {
      const details = err?.details || err?.data || {};
      const be = details?.errors || err?.errors || null;
      if (be && typeof be === "object") {
        applyBackendErrors(be);
      } else {
        setStatus("error");
        setMessage(details?.detail || err?.message || "No se pudo completar el registro.");
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
