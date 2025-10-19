export const getPrioridadColor = (prioridad) => {
  const colors = {
    crítica: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
    alta: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
    media:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
    baja: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
  };
  return colors[prioridad] || colors.media;
};

export const getEstadoColor = (estado) => {
  const colors = {
    pendiente:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
    en_revision:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
    resuelta:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
    rechazada: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
    activo:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
    inactivo:
      "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
  };
  return colors[estado] || colors.pendiente;
};

export const getRolColor = (rol) => {
  const colors = {
    ADMINISTRADOR:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
    MODERADOR:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
    VENDEDOR:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
    COMPRADOR:
      "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
  };
  return colors[rol] || colors.COMPRADOR;
};

export const getCategoriaColor = (categoria) => {
  const colors = {
    Electrónica:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
    Deportes:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
    Videojuegos:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
    Moda: "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200",
    Hogar:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
  };
  return (
    colors[categoria] ||
    "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
  );
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
