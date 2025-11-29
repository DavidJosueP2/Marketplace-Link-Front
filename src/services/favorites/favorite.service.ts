import api from "../api";
import type { MessageResponse } from "./interfaces/FavoritePublicationResponse";

const favoriteService = {

  addFavorite: async (publicationId: number): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      `/api/publications/${publicationId}/favorite`,
      null
    );
    
    return response.data;
  },

  removeFavorite: async (publicationId: number): Promise<void> => {
    await api.delete(
      `/api/publications/${publicationId}/favorite`
    );
  },

 
  getUserFavorites: async (page = 0, size = 10) => {

    const response = await api.get(`/api/users/favorites`, {
      params: { page, size },
    });

    // El backend devuelve PageResponse<FavoritePublicationResponse>
    return response.data;
  },

 
  isFavorite: async (publicationId: number): Promise<boolean> => {
    
    try {
      const response = await api.get<boolean>(
        `/api/publications/${publicationId}/favorite/check`
      );
      
      return response.data;
    } catch (error) {
      // Si hay error, asumimos que no está en favoritos
      console.error("Error checking favorite status:", error);
      return false;
    }
  },

  
  toggleFavorite: async (publicationId: number): Promise<boolean> => {
    const isFav = await favoriteService.isFavorite(publicationId);
    
    if (isFav) {
      await favoriteService.removeFavorite(publicationId);
      return false;
    } else {
      await favoriteService.addFavorite(publicationId);
      return true;
    }
  }
};

export default favoriteService;
