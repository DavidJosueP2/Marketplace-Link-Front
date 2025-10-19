/**
 * Helpers para aplicar colores del tema de manera consistente
 */

type Theme = "light" | "dark";

/**
 * Clases para cards según el tema
 */
export const getCardClasses = (theme: Theme): string => {
  return theme === "dark"
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
};

/**
 * Clases para texto primario según el tema
 */
export const getTextPrimaryClasses = (theme: Theme): string => {
  return theme === "dark" ? "text-white" : "text-gray-900";
};

/**
 * Clases para texto secundario según el tema
 */
export const getTextSecondaryClasses = (theme: Theme): string => {
  return theme === "dark" ? "text-gray-400" : "text-gray-600";
};

/**
 * Clases para texto terciario/disabled según el tema
 */
export const getTextTertiaryClasses = (theme: Theme): string => {
  return theme === "dark" ? "text-gray-500" : "text-gray-400";
};

/**
 * Clases para borders según el tema
 */
export const getBorderClasses = (theme: Theme): string => {
  return theme === "dark" ? "border-gray-700" : "border-gray-200";
};

/**
 * Clases para hover en backgrounds según el tema
 */
export const getHoverBgClasses = (theme: Theme): string => {
  return theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
};

/**
 * Clases para inputs según el tema
 */
export const getInputClasses = (theme: Theme): string => {
  const base = "w-full px-4 py-2 rounded-lg border-2 transition-all duration-200";
  const border = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-900";
  const placeholder = theme === "dark" ? "placeholder-gray-500" : "placeholder-gray-400";
  const focus = "focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]";
  
  return `${base} ${border} ${bg} ${text} ${placeholder} ${focus}`;
};

/**
 * Clases para botones según el tema y variante
 */
export const getButtonClasses = (
  variant: "primary" | "secondary" | "outline" | "ghost" = "primary",
  theme: Theme = "light"
): string => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md";
  
  switch (variant) {
    case "primary":
      return `${base} bg-[#FF9900] hover:bg-[#FFB84D] active:bg-[#CC7A00] text-white`;
    case "secondary":
      return theme === "dark"
        ? `${base} bg-gray-700 hover:bg-gray-600 text-white`
        : `${base} bg-gray-200 hover:bg-gray-300 text-gray-900`;
    case "outline":
      return `${base} border-2 border-[#FF9900] text-[#FF9900] hover:bg-[#FF9900] hover:text-white`;
    case "ghost":
      return theme === "dark"
        ? `${base} text-gray-300 hover:bg-gray-800 hover:text-white shadow-none`
        : `${base} text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-none`;
    default:
      return base;
  }
};

/**
 * Clases para badges/pills según tipo
 */
export const getBadgeClasses = (type: "success" | "warning" | "error" | "info" | "neutral" = "neutral"): string => {
  const base = "px-2 py-1 rounded-full text-xs font-medium";
  
  switch (type) {
    case "success":
      return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case "warning":
      return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    case "error":
      return `${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
    case "info":
      return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    case "neutral":
      return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    default:
      return base;
  }
};

/**
 * Clases para skeletons/loading según el tema
 */
export const getSkeletonClasses = (theme: Theme): string => {
  return theme === "dark"
    ? "bg-gray-700 animate-pulse"
    : "bg-gray-300 animate-pulse";
};

/**
 * Clases para tablas según el tema
 */
export const getTableClasses = (theme: Theme): { border: string; headerBg: string; rowHover: string } => {
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const headerBg = theme === "dark" ? "bg-gray-800" : "bg-gray-50";
  const rowHover = theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50";
  
  return { border, headerBg, rowHover };
};

/**
 * Clases para dividers según el tema
 */
export const getDividerClasses = (theme: Theme): string => {
  return theme === "dark" ? "border-gray-700" : "border-gray-200";
};

/**
 * Clases completas para un card con shadow y hover según tema
 */
export const getCardWithShadowClasses = (theme: Theme): string => {
  const base = "p-6 rounded-lg shadow transition-shadow duration-300";
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hover = "hover:shadow-lg";
  
  return `${base} ${bg} ${border} ${hover}`;
};

/**
 * Colores para iconos según el tema
 */
export const getIconColor = (theme: Theme, variant: "primary" | "secondary" | "tertiary" = "primary"): string => {
  if (variant === "primary") {
    return "#FF9900"; // Naranja Amazon (igual en ambos temas)
  }
  if (variant === "secondary") {
    return theme === "dark" ? "#9CA3AF" : "#6B7280"; // gray-400 / gray-500
  }
  // tertiary
  return theme === "dark" ? "#4B5563" : "#9CA3AF"; // gray-600 / gray-400
};

/**
 * Clases para links según el tema
 */
export const getLinkClasses = (theme: Theme): string => {
  return theme === "dark"
    ? "text-[#FFB84D] hover:text-[#FF9900] hover:underline"
    : "text-[#146EB4] hover:text-[#0D4A7A] hover:underline";
};

/**
 * Clases para modales/overlays según el tema
 */
export const getModalClasses = (theme: Theme): string => {
  const base = "rounded-lg shadow-xl";
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  
  return `${base} ${bg} ${border}`;
};

/**
 * Clases para tooltips según el tema
 */
export const getTooltipClasses = (theme: Theme): string => {
  return theme === "dark"
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-gray-800 text-white border-gray-800";
};

/**
 * Clases para badges de notificación (dot/ping)
 */
export const getNotificationBadgeClasses = (): string => {
  return "bg-red-500 text-white";
};

/**
 * Clases para progress bars según el tema
 */
export const getProgressBarClasses = (theme: Theme): { track: string; fill: string } => {
  const track = theme === "dark" ? "bg-gray-700" : "bg-gray-200";
  const fill = "bg-[#FF9900]"; // Color primario
  
  return { track, fill };
};
