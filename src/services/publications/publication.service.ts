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
  
  // IMPORTANTE: El backend Java compara getOriginalFilename() con img.getPath()
  // Para las imágenes existentes, necesitamos crear archivos "dummy" con el nombre correcto
  // o el backend las tratará como eliminadas
  
  if (request.existingImageUrls && request.existingImageUrls.length > 0) {
    // Crear archivos vacíos con los nombres de las imágenes existentes
    // para que el backend las reconozca y no las elimine
    request.existingImageUrls.forEach((url) => {
      // Extraer solo el nombre del archivo del path completo
      const filename = url.split('/').pop() || url;
      
      // Crear un Blob vacío con el nombre del archivo existente
      const dummyFile = new File([''], filename, { type: 'image/jpeg' });
      formData.append('images', dummyFile);
    });
  }
  
  // Agregar nuevas imágenes reales (File[])
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
}

}


export default publicationService;