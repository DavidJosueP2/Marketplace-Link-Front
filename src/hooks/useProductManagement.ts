import { useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * Custom hook para gestionar la lógica de productos
 * Centraliza: modales de producto, edición, eliminación, favoritos
 */
export const useProductManagement = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [favoritos, setFavoritos] = useState([1, 2, 5, 8]);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    ubicacion: "",
    disponibilidad: true,
    imagen: "",
  });
  const [showReporteModal, setShowReporteModal] = useState(false);
  const [reporteForm, setReporteForm] = useState({
    motivo: "",
    descripcion: "",
    evidencia: "",
  });
  const [isSubmittingReporte, setIsSubmittingReporte] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openProductModal = useCallback((product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setShowProductModal(false);
    setSelectedProduct(null);
  }, []);

  const openEditModal = useCallback((product) => {
    setProductToEdit(product);
    setEditForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      ubicacion: product.ubicacion,
      disponibilidad: product.disponibilidad,
      imagen: product.imagen,
    });
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setProductToEdit(null);
    setEditForm({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      ubicacion: "",
      disponibilidad: true,
      imagen: "",
    });
  }, []);

  const openDeleteModal = useCallback((item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    (callback) => {
      setIsDeleting(true);
      setTimeout(() => {
        if (itemToDelete) {
          toast.success(`${itemToDelete.nombre} eliminado correctamente`, {
            description: "El producto ha sido removido del catálogo",
            duration: 3000,
            icon: "🗑️",
          });
        }
        setIsDeleting(false);
        closeDeleteModal();
        if (callback) callback();
      }, 1000);
    },
    [itemToDelete, closeDeleteModal],
  );

  const openReporteModal = useCallback((product) => {
    setSelectedProduct(product);
    setShowReporteModal(true);
    setShowProductModal(false); // Cerrar modal de producto al abrir reporte
  }, []);

  const closeReporteModal = useCallback(() => {
    setShowReporteModal(false);
    setReporteForm({ motivo: "", descripcion: "", evidencia: "" });
  }, []);

  const handleSubmitReporte = useCallback(() => {
    if (!reporteForm.motivo || !reporteForm.descripcion) {
      toast.error("Por favor completa todos los campos requeridos", {
        description: "Motivo y descripción son obligatorios",
        duration: 3000,
      });
      return;
    }

    setIsSubmittingReporte(true);
    setTimeout(() => {
      toast.success("Reporte enviado exitosamente", {
        description: "Tu reporte será revisado en las próximas 24-48 horas",
        duration: 4000,
        icon: "📝",
      });
      closeReporteModal();
      setIsSubmittingReporte(false);
    }, 1200);
  }, [reporteForm, closeReporteModal]);

  const handleEditSubmit = useCallback(() => {
    if (!editForm.nombre.trim() || !editForm.precio) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    setIsSubmittingEdit(true);
    setTimeout(() => {
      toast.success("Producto actualizado correctamente");
      setIsSubmittingEdit(false);
      closeEditModal();
    }, 1000);
  }, [editForm, closeEditModal]);

  const toggleFavorite = useCallback((productId) => {
    setFavoritos((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isFavorite = useCallback(
    (productId) => {
      return favoritos.includes(productId);
    },
    [favoritos],
  );

  return {
    // Product Modal
    showProductModal,
    selectedProduct,
    openProductModal,
    closeProductModal,

    // Edit Modal
    showEditModal,
    productToEdit,
    editForm,
    setEditForm,
    isSubmittingEdit,
    openEditModal,
    closeEditModal,
    handleEditSubmit,

    // Delete Modal
    showDeleteModal,
    itemToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,

    // Reporte Modal
    showReporteModal,
    reporteForm,
    setReporteForm,
    isSubmittingReporte,
    openReporteModal,
    closeReporteModal,
    handleSubmitReporte,

    // Favoritos
    favoritos,
    toggleFavorite,
    isFavorite,
  };
};
