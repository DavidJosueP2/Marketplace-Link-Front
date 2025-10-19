/**
 * Sistema de Tema Centralizado - Inspirado en Amazon
 * Paleta: Amarillo-Naranja (#FF9900) con Azul Oscuro (#232F3E)
 */

export const theme = {
  // Colores principales
  colors: {
    primary: {
      main: "#FF9900", // Naranja Amazon
      light: "#FFB84D",
      dark: "#CC7A00",
      contrast: "#FFFFFF",
    },
    secondary: {
      main: "#232F3E", // Azul oscuro Amazon
      light: "#37475A",
      dark: "#131A22",
      contrast: "#FFFFFF",
    },
    accent: {
      main: "#146EB4", // Azul de links Amazon
      light: "#1E88E5",
      dark: "#0D4A7A",
    },
    // Estados
    success: {
      main: "#067D62",
      light: "#0F9D76",
      dark: "#045D4A",
      bg: "#D1F2EB",
      text: "#045D4A",
    },
    warning: {
      main: "#F08804",
      light: "#FFA726",
      dark: "#C46F03",
      bg: "#FFF3CD",
      text: "#C46F03",
    },
    error: {
      main: "#D13212",
      light: "#E74C3C",
      dark: "#A52A0E",
      bg: "#F8D7DA",
      text: "#A52A0E",
    },
    info: {
      main: "#0066C0",
      light: "#1976D2",
      dark: "#004C8C",
      bg: "#D9EDF7",
      text: "#004C8C",
    },
    // Neutrales
    neutral: {
      50: "#F7F8FA",
      100: "#EAEDED",
      200: "#D5D9D9",
      300: "#C7CBCC",
      400: "#8B9196",
      500: "#5F6368",
      600: "#3F4448",
      700: "#232F3E",
      800: "#1A242F",
      900: "#0F151C",
    },
    // Backgrounds
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
      sidebar: "#232F3E",
      header: "#131A22",
      hover: "#F3F3F3",
    },
  },

  // Dark mode
  dark: {
    colors: {
      primary: {
        main: "#FF9900",
        light: "#FFB84D",
        dark: "#CC7A00",
        contrast: "#FFFFFF",
      },
      secondary: {
        main: "#37475A",
        light: "#4A5F78",
        dark: "#232F3E",
        contrast: "#FFFFFF",
      },
      background: {
        default: "#0F151C",
        paper: "#1A242F",
        sidebar: "#131A22",
        header: "#0A0E14",
        hover: "#232F3E",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#EAEDED",
        disabled: "#8B9196",
      },
    },
  },

  // Tipografía
  typography: {
    fontFamily: {
      primary: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif",
      secondary: "'Inter', 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Espaciado
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Bordes
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px",
  },

  // Sombras
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Transiciones
  transitions: {
    fast: "150ms ease-in-out",
    base: "200ms ease-in-out",
    slow: "300ms ease-in-out",
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

// Utilidades para clases de Tailwind
export const themeClasses = {
  // Botones
  button: {
    primary:
      "bg-[#FF9900] hover:bg-[#FFB84D] active:bg-[#CC7A00] text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md",
    secondary:
      "bg-[#232F3E] hover:bg-[#37475A] active:bg-[#131A22] text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200",
    outline:
      "border-2 border-[#FF9900] text-[#FF9900] hover:bg-[#FF9900] hover:text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200",
    ghost:
      "text-[#232F3E] hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 font-medium px-4 py-2 rounded-lg transition-colors duration-200",
    link: "text-[#146EB4] hover:text-[#0D4A7A] hover:underline font-medium",
  },

  // Badges
  badge: {
    primary: "bg-[#FF9900] text-white px-2 py-1 rounded-full text-xs font-medium",
    secondary: "bg-[#232F3E] text-white px-2 py-1 rounded-full text-xs font-medium",
    success: "bg-[#067D62] text-white px-2 py-1 rounded-full text-xs font-medium",
    warning: "bg-[#F08804] text-white px-2 py-1 rounded-full text-xs font-medium",
    error: "bg-[#D13212] text-white px-2 py-1 rounded-full text-xs font-medium",
    info: "bg-[#0066C0] text-white px-2 py-1 rounded-full text-xs font-medium",
  },

  // Cards
  card: "bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700",

  // Inputs
  input:
    "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200",

  // Sidebar
  sidebar: {
    container: "bg-[#232F3E] dark:bg-[#131A22] border-r border-gray-700",
    item: "text-gray-300 hover:bg-[#37475A] hover:text-white transition-colors duration-200",
    itemActive: "bg-[#FF9900] text-white font-medium",
  },

  // Header
  header: {
    container: "bg-[#131A22] dark:bg-[#0A0E14] border-b border-gray-800",
    text: "text-white",
  },
} as const;

export type Theme = typeof theme;
export type ThemeClasses = typeof themeClasses;

export default theme;
