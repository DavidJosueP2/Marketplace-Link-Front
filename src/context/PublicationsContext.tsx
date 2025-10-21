import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import publicationService from "@/services/publications/publication.service";
import type { PublicationFilters } from "@/services/publications/interfaces/PublicationFiters";
import type { PublicationSummary } from "@/services/publications/interfaces/PublicationSummary";
import type { PageResponse } from "@/services/publications/interfaces/PageResponse";

interface PublicationsContextValue {
  publications: PublicationSummary[];
  totalPublications: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const PublicationsContext = createContext<PublicationsContextValue | undefined>(
  undefined
);

interface PublicationsProviderProps {
  children: ReactNode;
  filters?: PublicationFilters;
}

export const PublicationsProvider = ({
  children,
  filters = { page: 0, size: 1000 }, // Obtener todas para contar
}: PublicationsProviderProps) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<PageResponse<PublicationSummary>>({
    queryKey: ["publications", "all", filters],
    queryFn: () => publicationService.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const value: PublicationsContextValue = useMemo(
    () => ({
      publications: data?.content || [],
      totalPublications: data?.totalElements || 0,
      isLoading,
      error: error as Error | null,
      refetch,
    }),
    [data, isLoading, error, refetch]
  );

  return (
    <PublicationsContext.Provider value={value}>
      {children}
    </PublicationsContext.Provider>
  );
};

export const usePublicationsContext = () => {
  const context = useContext(PublicationsContext);
  if (context === undefined) {
    throw new Error(
      "usePublicationsContext must be used within a PublicationsProvider"
    );
  }
  return context;
};
