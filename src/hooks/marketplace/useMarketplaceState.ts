import { useState, useEffect } from "react";

/**
 * Custom hook para manejar el estado global del marketplace
 * Consolida todos los estados relacionados con la UI, filtros y datos
 */
export const useMarketplaceState = (
  initialProductos,
  initialIncidencias,
  initialUsuarios,
) => {
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [collapsedSections, setCollapsedSections] = useState({});

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [showIncidenciaModal, setShowIncidenciaModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApelacionModal, setShowApelacionModal] = useState(false);
  const [showReporteModal, setShowReporteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  // Selected Items
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchUsuario, setSearchUsuario] = useState("");

  // Filter States
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filtroPrecio, setFiltroPrecio] = useState("todos");
  const [filtroEstadoIncidencia, setFiltroEstadoIncidencia] = useState("todas");
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(1500);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [soloDisponibles, setSoloDisponibles] = useState(true);
  const [ubicacionesSeleccionadas, setUbicacionesSeleccionadas] = useState([]);
  const [filtroRolUsuario, setFiltroRolUsuario] = useState("todos");
  const [filtroEstadoUsuario, setFiltroEstadoUsuario] = useState("todos");

  // Loading States
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingIncidencias, setIsLoadingIncidencias] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingApelacion, setIsSubmittingApelacion] = useState(false);
  const [isSubmittingReporte, setIsSubmittingReporte] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Data States
  const [productos] = useState(initialProductos);
  const [incidencias] = useState(initialIncidencias);
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [favoritos, setFavoritos] = useState([1, 2, 5, 8]);

  // Pagination States
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [itemsPerPageProducts, setItemsPerPageProducts] = useState(9);
  const [currentPageIncidencias, setCurrentPageIncidencias] = useState(1);
  const [itemsPerPageIncidencias, setItemsPerPageIncidencias] = useState(10);

  // Form States
  const [apelacionForm, setApelacionForm] = useState({
    motivo: "",
    descripcion: "",
    evidencia: "",
  });

  const [reporteForm, setReporteForm] = useState({
    tipo: "",
    comentario: "",
  });

  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    ubicacion: "",
    disponibilidad: true,
    imagen: "",
  });

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

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingProducts(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingIncidencias(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPageProducts(1);
  }, [
    categoriasSeleccionadas,
    precioMin,
    precioMax,
    soloDisponibles,
    ubicacionesSeleccionadas,
  ]);

  useEffect(() => {
    setCurrentPageIncidencias(1);
  }, [filtroEstadoIncidencia]);

  return {
    // UI State
    ui: {
      sidebarOpen,
      setSidebarOpen,
      theme,
      setTheme,
      showUserMenu,
      setShowUserMenu,
      currentPage,
      setCurrentPage,
      collapsedSections,
      setCollapsedSections,
      showFilterSidebar,
      setShowFilterSidebar,
    },
    // Modal State
    modals: {
      showProductModal,
      setShowProductModal,
      showIncidenciaModal,
      setShowIncidenciaModal,
      showDeleteModal,
      setShowDeleteModal,
      showApelacionModal,
      setShowApelacionModal,
      showReporteModal,
      setShowReporteModal,
      showEditModal,
      setShowEditModal,
      showUserModal,
      setShowUserModal,
      showDeleteUserModal,
      setShowDeleteUserModal,
    },
    // Selected Items
    selected: {
      selectedProduct,
      setSelectedProduct,
      selectedIncidencia,
      setSelectedIncidencia,
      itemToDelete,
      setItemToDelete,
      productToEdit,
      setProductToEdit,
      userToEdit,
      setUserToEdit,
      userToDelete,
      setUserToDelete,
    },
    // Search State
    search: {
      searchQuery,
      setSearchQuery,
      showSearchResults,
      setShowSearchResults,
      searchFocused,
      setSearchFocused,
      searchUsuario,
      setSearchUsuario,
    },
    // Filter State
    filters: {
      filtroPrecio,
      setFiltroPrecio,
      filtroEstadoIncidencia,
      setFiltroEstadoIncidencia,
      precioMin,
      setPrecioMin,
      precioMax,
      setPrecioMax,
      categoriasSeleccionadas,
      setCategoriasSeleccionadas,
      soloDisponibles,
      setSoloDisponibles,
      ubicacionesSeleccionadas,
      setUbicacionesSeleccionadas,
      filtroRolUsuario,
      setFiltroRolUsuario,
      filtroEstadoUsuario,
      setFiltroEstadoUsuario,
    },
    // Loading State
    loading: {
      isLoadingProducts,
      setIsLoadingProducts,
      isLoadingIncidencias,
      setIsLoadingIncidencias,
      isSearching,
      setIsSearching,
      isDeleting,
      setIsDeleting,
      isSubmittingApelacion,
      setIsSubmittingApelacion,
      isSubmittingReporte,
      setIsSubmittingReporte,
      isSubmittingEdit,
      setIsSubmittingEdit,
      isSubmittingUser,
      setIsSubmittingUser,
      isDeletingUser,
      setIsDeletingUser,
    },
    // Data State
    data: {
      productos,
      incidencias,
      usuarios,
      setUsuarios,
      favoritos,
      setFavoritos,
    },
    // Pagination State
    pagination: {
      currentPageProducts,
      setCurrentPageProducts,
      itemsPerPageProducts,
      setItemsPerPageProducts,
      currentPageIncidencias,
      setCurrentPageIncidencias,
      itemsPerPageIncidencias,
      setItemsPerPageIncidencias,
    },
    // Form State
    forms: {
      apelacionForm,
      setApelacionForm,
      reporteForm,
      setReporteForm,
      editForm,
      setEditForm,
      userForm,
      setUserForm,
    },
  };
};
