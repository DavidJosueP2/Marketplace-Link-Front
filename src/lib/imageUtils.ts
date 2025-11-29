import { getApiUrl } from "@/config/env";

/**
 * Construye la URL completa de una imagen
 * @param imageUrl - URL de la imagen (puede ser relativa o absoluta)
 * @returns URL completa decodificada
 */
export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // Si ya es una URL completa (Azure Blob Storage), decodificarla y retornarla
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return decodeURIComponent(imageUrl);
  }
  
  // Si es una ruta relativa, construir la URL con el backend
  const baseUrl = getApiUrl();
  const cleanFileName = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
  return `${baseUrl}/${cleanFileName}`;
};
