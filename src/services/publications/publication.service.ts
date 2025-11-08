import api from "../api";
import type { PageResponse } from "./interfaces/PageResponse";
import type { PublicationFilters } from "./interfaces/PublicationFiters";
import type { VendorPublicationFilters } from "./interfaces/VendorPublicationFilters";
import type { PublicationSummary } from "./interfaces/PublicationSummary";
import type { PublicationResponse } from "./interfaces/PublicationResponse";
import type { PublicationCreateRequest } from "./interfaces/PublicationCreateRequest";
import type { PublicationUpdateRequest } from "./interfaces/PublicationUpdateRequest";

const publicationService = {

getAll: async (filters: PublicationFilters = {}): Promise<PageResponse<PublicationSummary>> => {
  const params: any = {
    page: filters.page,
    size: filters.size,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    lat: filters.lat,
    lon: filters.lon,
    distanceKm: filters.distanceKm,
  };

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    params.categoryIds = filters.categoryIds.join(',');
  }

  const response = await api.get<PageResponse<PublicationSummary>>("/api/publications", { params });
  return response.data;
},

getAllByVendor: async (filters: VendorPublicationFilters): Promise<PageResponse<PublicationSummary>> => {
  const params: any = {
    page: filters.page ?? 0,
    size: filters.size ?? 10,
    vendorId: filters.vendorId,
  };

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    params.categoryIds = filters.categoryIds.join(',');
  }

  const response = await api.get<PageResponse<PublicationSummary>>("/api/publications/by-vendor", { params });
  return response.data;
},

getById: async (id: number): Promise<PublicationResponse> => {
  const response = await api.get<PublicationResponse>(`/api/publications/${id}`);
  return response.data;
},

create: async (request: PublicationCreateRequest): Promise<PublicationResponse> => {
  const formData = new FormData();
  
  // Agregar campos de texto
  formData.append('name', request.name);
  formData.append('description', request.description);
  formData.append('price', request.price.toString());
  formData.append('latitude', request.latitude.toString());
  formData.append('longitude', request.longitude.toString());
  formData.append('categoryId', request.categoryId.toString());
  formData.append('vendorId', request.vendorId.toString());
  
  if (request.workingHours) {
    formData.append('workingHours', request.workingHours);
  }
  
  // Agregar imágenes
  request.images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await api.post<PublicationResponse>('/api/publications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
},

update: async (id: number, request: PublicationUpdateRequest): Promise<PublicationResponse> => {
  const formData = new FormData();
  
  // Agregar campos de texto
  formData.append('name', request.name);
  formData.append('description', request.description);
  formData.append('price', request.price.toString());
  formData.append('latitude', request.latitude.toString());
  formData.append('longitude', request.longitude.toString());
  formData.append('availability', request.availability);
  formData.append('categoryId', request.categoryId.toString());
  formData.append('vendorId', request.vendorId.toString());
  
  if (request.workingHours) {
    formData.append('workingHours', request.workingHours);
  }
  
  // IMPORTANTE: Para las imágenes existentes, el backend necesita recibir el nombre del archivo
  // tal como viene del GET. El backend compara f.getOriginalFilename() con img.getPath()
  // para determinar si mantener la imagen. Además, valida que el archivo tenga una firma
  // de imagen válida (JPEG: ffd8ff, PNG: 89504e47, etc.)
  
  // PRIMERO: Agregar las imágenes existentes (SIEMPRE, incluso si no hay nuevas imágenes)
  if (request.existingImageUrls && request.existingImageUrls.length > 0) {
    request.existingImageUrls.forEach((url) => {
      // La URL viene del backend como el path guardado (ej: "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg")
      // El backend devuelve image.getPath() directamente como url
      // Limpiar la URL: remover el "/" inicial si existe y cualquier ruta
      let cleanUrl = url.startsWith('/') ? url.substring(1) : url;
      
      // Extraer solo el nombre del archivo (última parte después de la última barra)
      // Esto es lo que el backend espera en getOriginalFilename()
      const filename = cleanUrl.split('/').pop() || cleanUrl;
      
      // Crear un archivo dummy con el nombre exacto del archivo existente
      // El archivo debe tener una firma de imagen válida para pasar la validación del backend
      // Para JPEG, la firma es: ffd8ff (los primeros 3 bytes)
      // El backend necesita al menos 4 bytes para validar la firma, así que agregamos un byte más
      // Nota: Este archivo dummy solo sirve para que el backend identifique la imagen existente
      // El backend NO guardará este archivo si el nombre coincide con una imagen existente
      const jpegSignature = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
      const dummyFile = new File([jpegSignature], filename, { type: 'image/jpeg' });
      formData.append('images', dummyFile);
    });
  }
  
  // DESPUÉS: Agregar nuevas imágenes reales (File[])
  if (request.images && request.images.length > 0) {
    request.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await api.put<PublicationResponse>(`/api/publications/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
},

delete: async (id: number): Promise<void> => {
  await api.delete(`/api/publications/${id}`);
}

}


export default publicationService;