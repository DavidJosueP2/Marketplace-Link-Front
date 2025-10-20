import api from "../api";
import type { PageResponse } from "./interfaces/PageResponse";
import type { PublicationFilters } from "./interfaces/PublicationFiters";
import type { PublicationSummary } from "./interfaces/PublicationSummary";

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
}

}


export default publicationService;