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
   * Obtiene el userId desde localStorage
   * Este dato se almacena después de un login exitoso en auth.service.ts
   */
  getUserId: (): number | null => {
    const userData = getUserData();
    return userData?.id ?? null;
  },

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
  addFavorite: async (publicationId: number, userId?: number): Promise<MessageResponse> => {
    const effectiveUserId = userId ?? favoriteService.getUserId();
    
    if (!effectiveUserId) {
      throw new Error("Usuario no autenticado. Por favor inicia sesión.");
    }

    const response = await api.post<MessageResponse>(
      `/api/publications/${publicationId}/favorite`,
      null,
      {
        params: { userId: effectiveUserId }
      }
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
  removeFavorite: async (publicationId: number, userId?: number): Promise<void> => {
    const effectiveUserId = userId ?? favoriteService.getUserId();
    
    if (!effectiveUserId) {
      throw new Error("Usuario no autenticado. Por favor inicia sesión.");
    }

    await api.delete(
      `/api/publications/${publicationId}/favorite`,
      {
        params: { userId: effectiveUserId }
      }
    );
  },

  /**
   * GET /api/users/{userId}/favorites
   * 
   * Obtiene todas las publicaciones favoritas de un usuario
   * Ordenadas por fecha de agregado (más recientes primero)
   * 
   * @param userId - ID del usuario (opcional, se obtiene del localStorage si no se proporciona)
   * @returns Array de publicaciones favoritas con toda su información
   * 
   * Errores:
   * - 404: Usuario no encontrado
   */
  getUserFavorites: async (userId?: number): Promise<FavoritePublicationResponse[]> => {
    const effectiveUserId = userId ?? favoriteService.getUserId();
    
    if (!effectiveUserId) {
      throw new Error("Usuario no autenticado. Por favor inicia sesión.");
    }

    const response = await api.get<FavoritePublicationResponse[]>(
      `/api/users/${effectiveUserId}/favorites`
    );
    
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
  isFavorite: async (publicationId: number, userId?: number): Promise<boolean> => {
    const effectiveUserId = userId ?? favoriteService.getUserId();
    
    if (!effectiveUserId) {
      // Si no hay usuario autenticado, no puede tener favoritos
      return false;
    }

    try {
      const response = await api.get<boolean>(
        `/api/publications/${publicationId}/favorite/check`,
        {
          params: { userId: effectiveUserId }
        }
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
  toggleFavorite: async (publicationId: number, userId?: number): Promise<boolean> => {
    const isFav = await favoriteService.isFavorite(publicationId, userId);
    
    if (isFav) {
      await favoriteService.removeFavorite(publicationId, userId);
      return false;
    } else {
      await favoriteService.addFavorite(publicationId, userId);
      return true;
    }
  }
};

export default favoriteService;
