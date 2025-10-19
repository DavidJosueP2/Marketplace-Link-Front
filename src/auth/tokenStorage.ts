const KEY = "mp_access_token";
export const getAccessToken = (): string | null => localStorage.getItem(KEY);
export const setAccessToken = (t?: string): void => localStorage.setItem(KEY, t ?? "");
export const clearTokens = (): void => localStorage.removeItem(KEY);
