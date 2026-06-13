// Runtime environment configuration
// Permite sobreescribir variables de entorno en tiempo de ejecución
// (via /config.js generado por docker-entrypoint.sh), sin recompilar la imagen.

declare global {
  interface Window {
    ENV?: {
      VITE_API_URL?: string;
    };
  }
}

/**
 * Get API URL from runtime config (window.ENV) or fallback to build-time env var
 */
export const getApiUrl = (): string => {
  // Try runtime config first (from /config.js generado por docker-entrypoint.sh)
  const runtimeUrl = window.ENV?.VITE_API_URL;
  
  // If runtime config exists and is not the placeholder, use it
  if (runtimeUrl && runtimeUrl !== 'VITE_API_URL_PLACEHOLDER') {
    return runtimeUrl;
  }
  
  // Fallback to build-time environment variable
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};

// Export configuration object
export const config = {
  apiUrl: getApiUrl(),
};

export default config;
