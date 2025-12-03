// Runtime environment configuration
// This allows overriding build-time env vars at runtime (important for Azure Container Apps)

declare global {
  interface Window {
    ENV?: {
      VITE_API_URL?: string;
    };
  }
}

/**
 * Get API URL from runtime config (window.ENV) or fallback to build-time env var
 * This function is called lazily to ensure window.ENV is loaded from config.js
 */
export const getApiUrl = (): string => {
  // Try runtime config first (from /config.js replaced by Docker entrypoint or Azure)
  const runtimeUrl = window.ENV?.VITE_API_URL;
  
  // If runtime config exists and is not the placeholder, use it
  if (runtimeUrl && runtimeUrl !== 'VITE_API_URL_PLACEHOLDER') {
    console.log('[Config] Using runtime API URL:', runtimeUrl);
    return runtimeUrl;
  }
  
  // Fallback to build-time environment variable
  const fallbackUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  console.log('[Config] Using fallback API URL:', fallbackUrl);
  return fallbackUrl;
};

// Export configuration object with lazy evaluation
export const config = {
  get apiUrl(): string {
    return getApiUrl();
  },
};

export default config;
