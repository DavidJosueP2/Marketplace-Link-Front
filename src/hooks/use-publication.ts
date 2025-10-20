import publicationService from "@/services/publications/publication.service";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PublicationFilters } from "@/services/publications/interfaces/PublicationFiters";
import type { PageResponse } from "@/services/publications/interfaces/PageResponse";
import type { PublicationSummary } from "@/services/publications/interfaces/PublicationSummary";

export const usePublications = (filters: PublicationFilters) => {
  return useQuery<PageResponse<PublicationSummary>, Error>({
    queryKey: ['publications', filters],
    queryFn: () => publicationService.getAll(filters),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData, 
  });
};