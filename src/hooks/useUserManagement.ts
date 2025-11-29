import { useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * Custom hook para gestionar usuarios (admin)
 * Centraliza: modales de usuario, edición, eliminación, filtros
 */
export const useUserManagement = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userForm, setUserForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cedula: "",
    telefono: "",
    direccion: "",
    genero: "",
    rol: "COMPRADOR",
    estado: "activo",
  });
  const [filtroRolUsuario, setFiltroRolUsuario] = useState("todos");
  const [filtroEstadoUsuario, setFiltroEstadoUsuario] = useState("todos");
  const [searchUsuario, setSearchUsuario] = useState("");
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const openUserModal = useCallback((user = null) => {
    if (user) {
      setUserToEdit(user);
      setUserForm({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        cedula: user.cedula || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        genero: user.genero || "",
        rol: user.rol || "COMPRADOR",
        estado: user.estado || "activo",
      });
    } else {
      setUserToEdit(null);
      setUserForm({
        nombre: "",
        apellido: "",
        email: "",
        cedula: "",
        telefono: "",
        direccion: "",
        genero: "",
        rol: "COMPRADOR",
        estado: "activo",
      });
    }
    setShowUserModal(true);
  }, []);

  const closeUserModal = useCallback(() => {
    setShowUserModal(false);
    setUserToEdit(null);
    setUserForm({
      nombre: "",
      apellido: "",
      email: "",
      cedula: "",
      telefono: "",
      direccion: "",
      genero: "",
      rol: "COMPRADOR",
      estado: "activo",
    });
  }, []);

  const openDeleteUserModal = useCallback((user) => {
    setUserToDelete(user);
    setShowDeleteUserModal(true);
  }, []);

  const closeDeleteUserModal = useCallback(() => {
    setShowDeleteUserModal(false);
    setUserToDelete(null);
  }, []);

  const handleUserSubmit = useCallback(
    (onSuccess) => {
      if (
        !userForm.nombre.trim() ||
        !userForm.apellido.trim() ||
        !userForm.email.trim() ||
        !userForm.cedula.trim()
      ) {
        toast.error("Por favor completa todos los campos obligatorios", {
          description: "Nombre, apellido, email y cédula son requeridos",
          duration: 3000,
        });
        return;
      }

      if (userForm.cedula.length !== 10) {
        toast.error("La cédula debe tener 10 dígitos", {
          duration: 2500,
        });
        return;
      }

      setIsSubmittingUser(true);
      setTimeout(() => {
        if (userToEdit) {
          toast.success("Usuario actualizado exitosamente", {
            description: `${userForm.nombre} ${userForm.apellido} ha sido actualizado`,
            duration: 3000,
            icon: "✅",
          });
        } else {
          toast.success("Usuario creado exitosamente", {
            description: `${userForm.nombre} ${userForm.apellido} ha sido agregado al sistema`,
            duration: 3000,
            icon: "🎉",
          });
        }
        setIsSubmittingUser(false);
        closeUserModal();
        if (onSuccess) onSuccess();
      }, 1200);
    },
    [userForm, userToEdit, closeUserModal],
  );

  const handleUserDelete = useCallback(
    (onSuccess) => {
      setIsDeletingUser(true);
      setTimeout(() => {
        if (userToDelete) {
          toast.success("Usuario eliminado", {
            description: `${userToDelete.nombre} ${userToDelete.apellido} ha sido eliminado del sistema`,
            duration: 3000,
            icon: "🗑️",
          });
        }
        setIsDeletingUser(false);
        closeDeleteUserModal();
        if (onSuccess) onSuccess();
      }, 1000);
    },
    [userToDelete, closeDeleteUserModal],
  );

  const handleToggleUserStatus = useCallback((usuario, onSuccess) => {
    const nuevoEstado = usuario.estado === "activo" ? "inactivo" : "activo";

    toast.info(
      `Usuario ${nuevoEstado === "activo" ? "activado" : "desactivado"}`,
      {
        description: `${usuario.nombre} ${usuario.apellido} ahora está ${nuevoEstado}`,
        duration: 2500,
        icon: nuevoEstado === "activo" ? "✅" : "🔒",
      },
    );

    if (onSuccess) onSuccess(nuevoEstado);
  }, []);

  return {
    showUserModal,
    showDeleteUserModal,
    userToEdit,
    userToDelete,
    userForm,
    setUserForm,
    filtroRolUsuario,
    setFiltroRolUsuario,
    filtroEstadoUsuario,
    setFiltroEstadoUsuario,
    searchUsuario,
    setSearchUsuario,
    isSubmittingUser,
    isDeletingUser,
    openUserModal,
    closeUserModal,
    openDeleteUserModal,
    closeDeleteUserModal,
    handleUserSubmit,
    handleUserDelete,
    handleToggleUserStatus,
  };
};
