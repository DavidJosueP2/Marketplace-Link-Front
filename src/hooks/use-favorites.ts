import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import favoriteService from "@/services/favorites/favorite.service";
import type { FavoritePublicationResponse } from "@/services/favorites/interfaces/FavoritePublicationResponse";
import type { PageResponse } from "@/services/publications/interfaces/PageResponse";

/**
 * Hook para verificar si una publicación es favorita
 * Se actualiza automáticamente cuando cambia el estado de favoritos
 */
export function useIsFavorite(publicationId: number) {
  const { data: isFavorite = false, isLoading } = useQuery({
    queryKey: ["favorite-status", publicationId],
    queryFn: () => favoriteService.isFavorite(publicationId),
    enabled: !!publicationId,
    staleTime: 1000 * 60, // 1 minuto
  });

  return { isFavorite, isLoading };
}

/**
 * Hook para obtener todos los favoritos del usuario
 */
export function useUserFavorites(page = 0, size = 10) {
  const { data, isLoading, error, refetch } = useQuery<PageResponse<FavoritePublicationResponse>>({
    // The backend identifies the user via the Authorization header, so do not include userId here
    queryKey: ["user-favorites", page, size],
    queryFn: () => favoriteService.getUserFavorites(page, size),
    staleTime: 1000 * 30, // 30 segundos
  });

  const favorites = data?.content ?? [];

  return {
    favorites,
    page: data?.number ?? page,
    size: data?.size ?? size,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook principal para gestionar favoritos
 * Incluye mutaciones para agregar, remover y toggle
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  // Mutación para agregar favorito
  const addFavoriteMutation = useMutation({
    mutationFn: ({ publicationId }: { publicationId: number }) =>
      favoriteService.addFavorite(publicationId),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["favorite-status", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
    },
  });

  // Mutación para remover favorito
  const removeFavoriteMutation = useMutation({
    mutationFn: ({ publicationId }: { publicationId: number }) =>
      favoriteService.removeFavorite(publicationId),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["favorite-status", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
    },
  });

  // Mutación para toggle (agregar o remover)
  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ publicationId }: { publicationId: number }) =>
      favoriteService.toggleFavorite(publicationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorite-status", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
    },
  });

  // Funciones helper
  const addFavorite = useCallback(
    (publicationId: number) => {
      return addFavoriteMutation.mutateAsync({ publicationId });
    },
    [addFavoriteMutation]
  );

  const removeFavorite = useCallback(
    (publicationId: number) => {
      return removeFavoriteMutation.mutateAsync({ publicationId });
    },
    [removeFavoriteMutation]
  );

  const toggleFavorite = useCallback(
    (publicationId: number) => {
      return toggleFavoriteMutation.mutateAsync({ publicationId });
    },
    [toggleFavoriteMutation]
  );

  return {
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isAdding: addFavoriteMutation.isPending,
    isRemoving: removeFavoriteMutation.isPending,
    isToggling: toggleFavoriteMutation.isPending,
    addError: addFavoriteMutation.error,
    removeError: removeFavoriteMutation.error,
    toggleError: toggleFavoriteMutation.error,
  };
}

/**
 * Hook todo-en-uno para gestionar favoritos en un componente de publicación
 * Combina el estado de favorito y las acciones
 */
export function usePublicationFavorite(publicationId: number) {
  const { isFavorite, isLoading: isCheckingFavorite } = useIsFavorite(publicationId);
  const { toggleFavorite, isToggling, toggleError } = useFavorites();

  const handleToggle = useCallback(async () => {
    try {
      await toggleFavorite(publicationId);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }, [publicationId, toggleFavorite]);

  return {
    isFavorite,
    isLoading: isCheckingFavorite || isToggling,
    toggleFavorite: handleToggle,
    error: toggleError,
  };
}
