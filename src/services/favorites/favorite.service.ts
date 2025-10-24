import api from "../api";
import type { FavoritePublicationResponse, MessageResponse } from "./interfaces/FavoritePublicationResponse";
import { getUserData } from "@/auth/userStorage";

/**
 * Servicio de favoritos siguiendo el patrón del backend FavoritePublicationController
 * 
 * Rutas del backend:
 * - POST   /api/publications/{publicationId}/favorite?userId={userId}
 * - DELETE /api/publications/{publicationId}/favorite?userId={userId}
 * - GET    /api/users/{userId}/favorites
 * - GET    /api/publications/{publicationId}/favorite/check?userId={userId}
 */

const favoriteService = {

  /**
   * POST /api/publications/{publicationId}/favorite?userId={userId}
   * 
   * Agrega una publicación a favoritos
   * 
   * @param publicationId - ID de la publicación
   * @param userId - ID del usuario (opcional, se obtiene del localStorage si no se proporciona)
   * @returns Mensaje de confirmación
   * 
   * Respuesta exitosa (201): { message: "Publicación agregada a favoritos exitosamente" }
   * Errores:
   * - 404: Usuario o publicación no encontrados
   * - 409: La publicación ya está marcada como favorita
   */
  addFavorite: async (publicationId: number): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      `/api/publications/${publicationId}/favorite`,
      null
    );
    
    return response.data;
  },

  /**
   * DELETE /api/publications/{publicationId}/favorite?userId={userId}
   * 
   * Remueve una publicación de favoritos
   * 
   * @param publicationId - ID de la publicación
   * @param userId - ID del usuario (opcional, se obtiene del localStorage si no se proporciona)
   * @returns void (204 No Content)
   * 
   * Errores:
   * - 404: El favorito no existe
   */
  removeFavorite: async (publicationId: number): Promise<void> => {
    await api.delete(
      `/api/publications/${publicationId}/favorite`
    );
  },

  /**
   * GET /api/users/{userId}/favorites
   * 
   * Obtiene las publicaciones favoritas de un usuario con paginación.
   * El backend ahora devuelve un objeto PageResponse<FavoritePublicationResponse>.
   *
   * @param userId - ID del usuario (opcional, se obtiene del localStorage si no se proporciona)
   * @param page - número de página (0-based)
   * @param size - tamaño de página
   * @returns PageResponse<FavoritePublicationResponse>
   * 
   * Errores:
   * - 404: Usuario no encontrado
   */
  getUserFavorites: async (page = 0, size = 10) => {

    const response = await api.get(`/api/users/favorites`, {
      params: { page, size },
    });

    // El backend devuelve PageResponse<FavoritePublicationResponse>
    return response.data;
  },

  /**
   * GET /api/publications/{publicationId}/favorite/check?userId={userId}
   * 
   * Verifica si una publicación está marcada como favorita
   * 
   * @param publicationId - ID de la publicación
   * @param userId - ID del usuario (opcional, se obtiene del localStorage si no se proporciona)
   * @returns true si está en favoritos, false si no
   */
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

  /**
   * Función auxiliar para alternar el estado de favorito
   * Útil para componentes con botón de toggle
   * 
   * @param publicationId - ID de la publicación
   * @param userId - ID del usuario (opcional)
   * @returns nuevo estado (true = agregado, false = removido)
   */
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
