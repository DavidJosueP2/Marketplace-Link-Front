import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useUserFavorites } from "@/hooks/use-favorites";
import type { FavoritePublicationResponse } from "@/services/favorites/interfaces/FavoritePublicationResponse";

interface FavoritesContextValue {
  favorites: FavoritePublicationResponse[];
  favoritesCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { favorites, isLoading, error, refetch } = useUserFavorites();

  const value: FavoritesContextValue = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      isLoading,
      error,
      refetch,
    }),
    [favorites, isLoading, error, refetch]
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
