import { useState, useMemo, useEffect } from "react";
import { Edit, Unlock, RotateCcw, Ban, UserX, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import {
  UserEditModal,
  ConfirmActionModal,
  ModeratorCreateModal,
} from "@/components/users";
import { ModeratorKPIs, ModeratorFilters } from "@/components/users";
import {
  useUsersPaginated,
  useBlockUser,
  useUnblockUser,
  useActivateUser,
  useDeactivateUser,
} from "@/hooks/users";
import DataTable from "@/components/ui/table/data-table-pb";
import CenteredSpinner from "@/components/ui/CenteredSpinner";
import { useAuth } from "@/hooks/use-auth";
import type { UserResponse } from "@/services/users/types";

/**
 * ModeradoresPage - Gestión de moderadores
 * 
 * Solo muestra usuarios con ROLE_MODERATOR
 * Incluye moderadores eliminados para poder reactivarlos
 */
export default function ModeradoresPage() {
  const { user: currentUser } = useAuth();

  // Modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"block" | "unblock" | "activate" | "deactivate" | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  // Filtros locales
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Paginación
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Permisos - solo admin puede gestionar moderadores
  const isAdmin = currentUser?.roles?.some(r => typeof r !== 'string' && r.name === "ROLE_ADMIN") || false;

  // Combinar las 2 búsquedas para enviar al servidor
  const combinedSearch = [searchQuery, searchQuery2].filter(Boolean).join(" ");

  // Query paginada - solo ROLE_MODERATOR, incluye eliminados
  const { data: paginatedData, isLoading, error } = useUsersPaginated({
    page,
    size,
    search: combinedSearch || undefined,
    roles: ["ROLE_MODERATOR"],
    includeDeleted: true,
    sortBy: "id",
    sortDir: "desc",
  });

  // Mutaciones
  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnblockUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();

  const moderators = paginatedData?.content || [];

  // Filtrado adicional en cliente (estado)
  const filteredModerators = useMemo(() => {
    let filtered = [...moderators];

    // Filtrar por estado
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(u => u.accountStatus === statusFilter);
    }

    return filtered;
  }, [moderators, statusFilter]);

  // Reset a página 1 cuando cambian los filtros
  useEffect(() => {
    setPage(0);
  }, [searchQuery, searchQuery2, statusFilter]);

  // Helpers
  const getStatusBadgeClass = (status: string) => {
    const baseClasses = "px-2.5 py-1 rounded-full text-xs font-semibold border";
    switch (status) {
      case "ACTIVE":
        return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800`;
      case "INACTIVE":
        return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700`;
      case "BLOCKED":
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800`;
      case "PENDING_VERIFICATION":
        return `${baseClasses} bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800`;
      default:
        return baseClasses;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: "Activo",
      INACTIVE: "Inactivo",
      BLOCKED: "Bloqueado",
      PENDING_VERIFICATION: "Pendiente",
    };
    return labels[status] || status;
  };

  // Verificar si se puede interactuar con el moderador
  const canInteract = (user: UserResponse): boolean => {
    // No puede modificarse a sí mismo
    if (Number(user.id) === Number(currentUser?.id)) return false;
    return true;
  };

  const canBlock = (user: UserResponse): boolean => {
    if (!canInteract(user)) return false;
    if (!isAdmin) return false;
    if (user.accountStatus === "PENDING_VERIFICATION") return false;
    if (user.accountStatus === "INACTIVE") return false;
    if (user.accountStatus === "BLOCKED") return false;
    return true;
  };

  const canUnblock = (user: UserResponse): boolean => {
    if (!canInteract(user)) return false;
    return user.accountStatus === "BLOCKED" && isAdmin;
  };

  const canDeactivate = (user: UserResponse): boolean => {
    if (!canInteract(user)) return false;
    if (!isAdmin) return false;
    return user.accountStatus === "ACTIVE";
  };

  const canActivate = (user: UserResponse): boolean => {
    if (!canInteract(user)) return false;
    if (!isAdmin) return false;
    return user.accountStatus === "INACTIVE";
  };

  const canEdit = (user: UserResponse): boolean => {
    if (!canInteract(user)) return false;
    if (user.accountStatus === "PENDING_VERIFICATION") return false;
    return user.accountStatus === "ACTIVE";
  };

  // Handlers
  const handleEdit = (user: UserResponse) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleBlock = (user: UserResponse) => {
    setSelectedUser(user);
    setConfirmAction("block");
    setShowConfirmModal(true);
  };

  const handleUnblock = (user: UserResponse) => {
    setSelectedUser(user);
    setConfirmAction("unblock");
    setShowConfirmModal(true);
  };

  const handleDeactivate = (user: UserResponse) => {
    setSelectedUser(user);
    setConfirmAction("deactivate");
    setShowConfirmModal(true);
  };

  const handleActivate = (user: UserResponse) => {
    setSelectedUser(user);
    setConfirmAction("activate");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !confirmAction) return;

    switch (confirmAction) {
      case "block":
        await blockUserMutation.mutateAsync(selectedUser.id);
        break;
      case "unblock":
        await unblockUserMutation.mutateAsync(selectedUser.id);
        break;
      case "activate":
        await activateUserMutation.mutateAsync(selectedUser.id);
        break;
      case "deactivate":
        await deactivateUserMutation.mutateAsync(selectedUser.id);
        break;
    }

    setShowConfirmModal(false);
    setSelectedUser(null);
    setConfirmAction(null);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchQuery2("");
    setStatusFilter("ALL");
  };

  // Función para obtener iniciales
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Definición de columnas para DataTable
  const columns = useMemo(() => [
    {
      accessorKey: "fullName",
      header: "Moderador",
      cell: ({ row }: any) => {
        const user = row.original;
        const initials = getInitials(user.fullName);
        return (
          <div className="flex items-center gap-3 py-2 pl-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-base">{user.fullName}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "cedula",
      header: "Cédula",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm">{row.original.cedula}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }: any) => (
        <span className="text-sm">{row.original.phone}</span>
      ),
    },
    {
      accessorKey: "accountStatus",
      header: "Estado",
      cell: ({ row }: any) => {
        const user = row.original;
        return (
          <span className={getStatusBadgeClass(user.accountStatus)}>
            {getStatusLabel(user.accountStatus)}
          </span>
        );
      },
    },
  ], []);

  // Acciones por fila
  const rowActions = (row: any) => {
    const user: UserResponse = row.original;

    const editEnabled = canEdit(user);
    const blockEnabled = canBlock(user);
    const unblockEnabled = canUnblock(user);
    const activateEnabled = canActivate(user);
    const deactivateEnabled = canDeactivate(user);

    return (
      <TooltipProvider>
        <div className="flex gap-1 justify-start">
          {/* Editar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editEnabled && handleEdit(user)}
                disabled={!editEnabled}
                className={editEnabled 
                  ? "hover:bg-blue-50 dark:hover:bg-blue-950" 
                  : "opacity-50 cursor-not-allowed"
                }
              >
                <Edit size={16} className="text-blue-600 dark:text-blue-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {editEnabled ? "Editar moderador" : "No se puede editar"}
            </TooltipContent>
          </Tooltip>

          {/* Bloquear */}
          {isAdmin && !unblockEnabled && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => blockEnabled && handleBlock(user)}
                  disabled={!blockEnabled}
                  className={blockEnabled
                    ? "hover:bg-orange-50 dark:hover:bg-orange-950"
                    : "opacity-50 cursor-not-allowed"
                  }
                >
                  <Ban size={16} className="text-orange-600 dark:text-orange-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {blockEnabled ? "Bloquear moderador" : "No se puede bloquear"}
              </TooltipContent>
            </Tooltip>
          )}

          {/* Desbloquear */}
          {unblockEnabled && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnblock(user)}
                  className="hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <Unlock size={16} className="text-green-600 dark:text-green-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desbloquear moderador</TooltipContent>
            </Tooltip>
          )}

          {/* Activar (solo si está INACTIVE) */}
          {activateEnabled && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleActivate(user)}
                  className="hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <RotateCcw size={16} className="text-blue-600 dark:text-blue-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reactivar moderador</TooltipContent>
            </Tooltip>
          )}

          {/* Desactivar */}
          {isAdmin && !activateEnabled && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deactivateEnabled && handleDeactivate(user)}
                  disabled={!deactivateEnabled}
                  className={deactivateEnabled 
                    ? "hover:bg-red-50 dark:hover:bg-red-950" 
                    : "opacity-50 cursor-not-allowed"
                  }
                >
                  <UserX size={16} className="text-red-600 dark:text-red-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {deactivateEnabled ? "Desactivar moderador" : "No se puede desactivar"}
              </TooltipContent>
            </Tooltip>
          )}


        </div>
      </TooltipProvider>
    );
  };

  if (isLoading && !paginatedData) {
    return <CenteredSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-red-600 dark:text-red-400 mb-4">Error al cargar los moderadores</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      {/* Header */}
      <div className="bg-card p-6 rounded-lg shadow border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              Gestión de Moderadores
            </h1>
            <p className="text-muted-foreground">
              Administra los moderadores del sistema
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus size={20} className="mr-2" />
              Nuevo Moderador
            </Button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <ModeratorKPIs moderators={filteredModerators} />

      {/* Filtros */}
      <ModeratorFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchQuery2={searchQuery2}
        onSearchChange2={setSearchQuery2}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Tabla con paginación del servidor */}
      <DataTable
        columns={columns}
        data={filteredModerators}
        rowActions={rowActions}
        actionsHeader="Acciones"
        manualPagination
        pageCount={paginatedData?.totalPages ?? 0}
        totalRows={paginatedData?.totalElements ?? 0}
        state={{
          pagination: {
            pageIndex: page,
            pageSize: size,
          },
        }}
        onPaginationChange={({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
          setPage(pageIndex);
          setSize(pageSize);
        }}
        searchable={false}
        emptyMessage="No se encontraron moderadores con los filtros aplicados"
        initialPageSize={10}
        globalFilterFn={undefined}
        onSelectionChange={undefined}
        className={undefined}
      />

      {/* Modales */}
      <ModeratorCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <UserEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <ConfirmActionModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedUser(null);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
        user={selectedUser}
        action={confirmAction || "block"}
        isLoading={
          blockUserMutation.isPending ||
          unblockUserMutation.isPending ||
          activateUserMutation.isPending ||
          deactivateUserMutation.isPending
        }
      />
    </div>
  );
}
