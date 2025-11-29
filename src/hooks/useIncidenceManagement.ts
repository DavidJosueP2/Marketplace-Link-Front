import { useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * Custom hook para gestionar la lógica de incidencias
 * Centraliza: modales de incidencias, reportes, apelaciones
 */
export const useIncidenceManagement = () => {
  const [showIncidenciaModal, setShowIncidenciaModal] = useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);
  const [showReporteModal, setShowReporteModal] = useState(false);
  const [reporteForm, setReporteForm] = useState({
    tipo: "",
    comentario: "",
  });
  const [isSubmittingReporte, setIsSubmittingReporte] = useState(false);
  const [showApelacionModal, setShowApelacionModal] = useState(false);
  const [apelacionForm, setApelacionForm] = useState({
    motivo: "",
    descripcion: "",
    evidencia: "",
  });
  const [isSubmittingApelacion, setIsSubmittingApelacion] = useState(false);

  const openIncidenciaModal = useCallback((incidencia) => {
    setSelectedIncidencia(incidencia);
    setShowIncidenciaModal(true);
  }, []);

  const closeIncidenciaModal = useCallback(() => {
    setShowIncidenciaModal(false);
    setSelectedIncidencia(null);
  }, []);

  const openReporteModal = useCallback((incidencia) => {
    setSelectedIncidencia(incidencia);
    setShowReporteModal(true);
  }, []);

  const closeReporteModal = useCallback(() => {
    setShowReporteModal(false);
    setReporteForm({ tipo: "", comentario: "" });
  }, []);

  const handleReporteSubmit = useCallback(() => {
    if (!reporteForm.tipo.trim() || !reporteForm.comentario.trim()) {
      toast.error("Completa todos los campos del reporte");
      return;
    }
    setIsSubmittingReporte(true);
    setTimeout(() => {
      toast.success("Reporte enviado correctamente");
      setIsSubmittingReporte(false);
      closeReporteModal();
    }, 1000);
  }, [reporteForm, closeReporteModal]);

  const openApelacionModal = useCallback((incidencia) => {
    setSelectedIncidencia(incidencia);
    setShowApelacionModal(true);
  }, []);

  const closeApelacionModal = useCallback(() => {
    setShowApelacionModal(false);
    setApelacionForm({
      motivo: "",
      descripcion: "",
      evidencia: "",
    });
  }, []);

  const handleApelacionSubmit = useCallback(() => {
    if (!apelacionForm.motivo || !apelacionForm.descripcion) {
      toast.error("Por favor completa todos los campos requeridos", {
        description: "Motivo y descripción son obligatorios",
        duration: 3000,
      });
      return;
    }

    setIsSubmittingApelacion(true);
    setTimeout(() => {
      toast.success("Apelación enviada exitosamente", {
        description: "Tu apelación será revisada en las próximas 24-48 horas",
        duration: 4000,
        icon: "📝",
      });
      setIsSubmittingApelacion(false);
      closeApelacionModal();
    }, 1200);
  }, [apelacionForm, closeApelacionModal]);

  const handleAprobarIncidencia = useCallback(
    (incidencia) => {
      toast.success(`Incidencia #${incidencia.id} aprobada`, {
        description: "El producto ha sido reactivado",
        duration: 3000,
      });
      closeIncidenciaModal();
    },
    [closeIncidenciaModal],
  );

  const handleRechazarIncidencia = useCallback(
    (incidencia) => {
      toast.error(`Incidencia #${incidencia.id} rechazada`, {
        description: "El producto permanecerá suspendido",
        duration: 3000,
      });
      closeIncidenciaModal();
    },
    [closeIncidenciaModal],
  );

  return {
    // Incidencia Modal
    showIncidenciaModal,
    selectedIncidencia,
    openIncidenciaModal,
    closeIncidenciaModal,
    handleAprobarIncidencia,
    handleRechazarIncidencia,

    // Reporte Modal
    showReporteModal,
    reporteForm,
    setReporteForm,
    isSubmittingReporte,
    openReporteModal,
    closeReporteModal,
    handleReporteSubmit,

    // Apelación Modal
    showApelacionModal,
    apelacionForm,
    setApelacionForm,
    isSubmittingApelacion,
    openApelacionModal,
    closeApelacionModal,
    handleApelacionSubmit,
  };
};
