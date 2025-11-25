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
  images: File[]; // Todas las imágenes: archivos dummy (para mantener existentes) + nuevas imágenes
}
