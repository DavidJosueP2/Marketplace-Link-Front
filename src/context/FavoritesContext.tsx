import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useUserFavorites } from "@/hooks/use-favorites";
import type { FavoritePublicationResponse } from "@/services/favorites/interfaces/FavoritePublicationResponse";

interface FavoritesContextValue {
  favorites: FavoritePublicationResponse[];
  favoritesCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  // Pagination
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  setPage: (p: number) => void;
  setSize: (s: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  const { favorites, isLoading, error, refetch, totalElements, totalPages } =
    useUserFavorites(page, size);

  const value: FavoritesContextValue = useMemo(
    () => ({
      favorites,
      favoritesCount: totalElements ?? favorites.length,
      isLoading,
      error,
      refetch,
      page,
      size,
      totalElements: totalElements ?? favorites.length,
      totalPages: totalPages ?? 0,
      setPage,
      setSize,
    }),
    [favorites, isLoading, error, refetch, page, size, totalElements, totalPages]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesContext must be used within a FavoritesProvider"
    );
  }
  return context;
};
