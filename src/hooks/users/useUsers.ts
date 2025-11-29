import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import usersService from "@/services/users/users.service";
import type {
  ModeratorCreateRequest,
  UserUpdateRequest,
  UsersListParams,
} from "@/services/users/types";
import { ApiError } from "@/services/api";

/**
 * Hook para obtener todos los usuarios
 */
export const useUsers = (params?: UsersListParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener usuarios paginados
 */
export const useUsersPaginated = (params?: UsersListParams) => {
  return useQuery({
    queryKey: ["users-paginated", params],
    queryFn: () => usersService.getAllPaginated(params),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

/**
 * Hook para obtener un usuario por ID
 */
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersService.getById(userId),
    enabled: !!userId,
  });
};

/**
 * Hook para crear un moderador (solo admins)
 */
export const useCreateModerator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModeratorCreateRequest) => usersService.createModerator(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Moderador creado exitosamente", {
        description: `${data.fullName} ha sido agregado como moderador. Se le ha enviado un correo para establecer su contraseña.`,
        duration: 4000,
      });
    },
    onError: (error: ApiError) => {
      const message = error?.payload?.message || "Error al crear el moderador";
      toast.error("No se pudo crear el moderador", {
        description: message,
        duration: 4000,
      });
    },
  });
};

/**
 * Hook para actualizar un usuario
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UserUpdateRequest }) =>
      usersService.update(userId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
      toast.success("Usuario actualizado", {
        description: `Los datos de ${data.fullName} han sido actualizados correctamente.`,
        duration: 3000,
      });
    },
    onError: (error: ApiError) => {
      const message = error?.payload?.message || "Error al actualizar el usuario";
      toast.error("No se pudo actualizar el usuario", {
        description: message,
        duration: 4000,
      });
    },
  });
};

/**
 * Hook para activar un usuario (solo admins)
 */
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => usersService.activate(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-paginated"] });
      toast.success("Usuario activado", {
        description: "El usuario ha sido activado correctamente.",
        duration: 3000,
      });
    },
    onError: (error: ApiError) => {
      const message = error?.payload?.message || "Error al activar el usuario";
      toast.error("No se pudo activar el usuario", {
        description: message,
        duration: 4000,
      });
    },
  });
};

/**
 * Hook para desactivar un usuario (solo admins)
 */
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => usersService.deactivate(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-paginated"] });
      toast.success("Usuario desactivado", {
        description: "El usuario ha sido desactivado correctamente.",
        duration: 3000,
      });
    },
    onError: (error: ApiError) => {
      const message = error?.payload?.message || "Error al desactivar el usuario";
      toast.error("No se pudo desactivar el usuario", {
        description: message,
        duration: 4000,
      });
    },
  });
};

/**
 * Hook para bloquear un usuario (admins y moderadores)
 */
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => usersService.block(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-paginated"] });
      toast.success("Usuario bloqueado", {
        description: "El usuario ha sido bloqueado correctamente.",
        duration: 3000,
      });
    },
    onError: (error: ApiError) => {
      const message = error?.payload?.message || "Error al bloquear el usuario";
      toast.error("No se pudo bloquear el usuario", {
        description: message,
        duration: 4000,
      });
    },
  });
};

/**
 * Hook para desbloquear un usuario (admins y moderadores)
 */
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => usersService.unblock(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-paginated"] });
      toast.success("Usuario desbloqueado", {
        description: "El usuario ha sido desbloqueado correctamente.",
        duration: 3000,
      });
    },
    onError: (error: ApiError) => {
      const message = error?.payload?.message || "Error al desbloquear el usuario";
      toast.error("No se pudo desbloquear el usuario", {
        description: message,
        duration: 4000,
      });
    },
  });
};

