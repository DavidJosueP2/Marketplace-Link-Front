import { useQuery } from "@tanstack/react-query";
import publicationService from "@/services/publications/publication.service";
import type { PublicationResponse } from "@/services/publications/interfaces/PublicationResponse";

export const usePublicationDetail = (id: number) => {
  return useQuery<PublicationResponse, Error>({
    queryKey: ['publication', id],
    queryFn: () => publicationService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
