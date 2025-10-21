export interface PublicationCreateRequest {
  name: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  workingHours?: string;
  categoryId: number;
  vendorId: number;
  images: File[];
}
