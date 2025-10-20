export interface PublicationFilters {
  page?: number;
  size?: number;
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lon?: number;
  distanceKm?: number;
}