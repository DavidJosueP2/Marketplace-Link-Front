import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import publicationService from "@/services/publications/publication.service";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook personalizado para acciones CRUD de publicaciones del vendedor
 * Maneja delete con invalidación automática de cache (sin recargar página)
 */
export const useVendorPublicationsActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Elimina una publicación y refresca la lista automáticamente
   * @param publicationId - ID de la publicación a eliminar
   * @param currentPage - Página actual para ajustar paginación si es necesario
   * @param publicationsCount - Cantidad de publicaciones en la página actual
   * @returns Objeto con success (boolean) y newPage (número de página a mostrar)
   */
  const deletePublication = async (
    publicationId: number,
    currentPage: number = 0,
    publicationsCount: number = 0
  ): Promise<{ success: boolean; newPage: number }> => {
    setIsDeleting(true);
    try {
      await publicationService.delete(publicationId);

      // Invalidar todas las queries de vendor-publications para refrescar automáticamente
      await queryClient.invalidateQueries({
        queryKey: ['vendor-publications'],
      });

      toast({
        title: "¡Publicación eliminada!",
        description: "La publicación ha sido eliminada exitosamente.",
        variant: "default",
      });

      // Si era el último elemento de la página y no estamos en la primera, ir a página anterior
      const newPage = publicationsCount === 1 && currentPage > 0 ? currentPage - 1 : currentPage;

      return { success: true, newPage };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "No se pudo eliminar la publicación. Por favor, intenta nuevamente.";

      toast({
        title: "Error al eliminar",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, newPage: currentPage };
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Refresca manualmente la lista de publicaciones
   */
  const refreshPublications = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['vendor-publications'],
    });
  };

  return {
    deletePublication,
    refreshPublications,
    isDeleting,
  };
};
