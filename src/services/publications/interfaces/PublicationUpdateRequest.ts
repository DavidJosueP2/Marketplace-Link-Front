export interface PublicationUpdateRequest {
  name: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  availability: "AVAILABLE" | "UNAVAILABLE";
  workingHours?: string;
  categoryId: number;
  vendorId: number;
  images: File[]; // Nuevas imágenes a subir
  existingImageUrls?: string[]; // URLs de imágenes existentes que se mantienen
}
