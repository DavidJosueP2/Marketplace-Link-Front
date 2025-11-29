export interface VendorPublicationFilters {
  page?: number;
  size?: number;
  categoryIds?: number[]; // Filtrar por categorías
  vendorId: number; // Obligatorio
}
