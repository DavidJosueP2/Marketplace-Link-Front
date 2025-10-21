import { useQuery, keepPreviousData } from "@tanstack/react-query";
import publicationService from "@/services/publications/publication.service";
import type { VendorPublicationFilters } from "@/services/publications/interfaces/VendorPublicationFilters";
import type { PageResponse } from "@/services/publications/interfaces/PageResponse";
import type { PublicationSummary } from "@/services/publications/interfaces/PublicationSummary";

export const useVendorPublications = (filters: VendorPublicationFilters) => {
  return useQuery<PageResponse<PublicationSummary>, Error>({
    queryKey: ['vendor-publications', filters],
    queryFn: () => publicationService.getAllByVendor(filters),
    staleTime: 1000 * 60, // 1 minuto
    placeholderData: keepPreviousData,
    enabled: !!filters.vendorId && filters.vendorId > 0, // Solo ejecutar si hay vendorId válido
  });
};
