import { Edit, Lock, Unlock, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import type { UserResponse } from "@/services/users/types";
import { getAccountStatusLabel, getRoleLabel, hasRole } from "@/services/users/types";

interface UserTableProps {
  users: UserResponse[];
  onEdit: (user: UserResponse) => void;
  onBlock: (user: UserResponse) => void;
  onUnblock: (user: UserResponse) => void;
  onActivate: (user: UserResponse) => void;
  onDeactivate: (user: UserResponse) => void;
  isAdmin: boolean;
  isModerator: boolean;
  currentUserId: number;
}

export default function UserTable({
  users,
  onEdit,
  onBlock,
  onUnblock,
  onActivate,
  onDeactivate,
  isAdmin,
  isModerator,
  currentUserId,
}: UserTableProps) {
  const canManageUser = (user: UserResponse): boolean => {
    // No puede modificarse a sí mismo
    if (user.id === currentUserId) return false;

    // Si es admin, puede gestionar a todos excepto otros admins
    if (isAdmin) {
      return !hasRole(user, "ADMIN");
    }

    // Si es moderador, solo puede gestionar compradores y vendedores
    if (isModerator) {
      return (
        !hasRole(user, "ADMIN") &&
        !hasRole(user, "MODERATOR") &&
        (hasRole(user, "BUYER") || hasRole(user, "VENDOR"))
      );
    }

    return false;
  };

  const canBlockUser = (user: UserResponse): boolean => {
    return (isAdmin || isModerator) && canManageUser(user);
  };

  const canActivateDeactivate = (user: UserResponse): boolean => {
    return isAdmin && canManageUser(user);
  };

  const getStatusBadgeClass = (status: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "ACTIVE":
        return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400`;
      case "INACTIVE":
        return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400`;
      case "BLOCKED":
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400`;
      case "PENDING_VERIFICATION":
        return `${baseClasses} bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400`;
      default:
        return baseClasses;
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol(es)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                      >
                        {getRoleLabel(role.name)}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={getStatusBadgeClass(user.accountStatus)}>
                    {getAccountStatusLabel(user.accountStatus as any)}
                  </span>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex gap-1 justify-end">
                      {/* Editar (admins y moderadores para usuarios permitidos) */}
                      {canManageUser(user) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(user)}
                            >
                              <Edit size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar usuario</TooltipContent>
                        </Tooltip>
                      )}

                      {/* Bloquear/Desbloquear (admins y moderadores) */}
                      {canBlockUser(user) && (
                        <>
                          {user.accountStatus === "BLOCKED" ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onUnblock(user)}
                                >
                                  <Unlock size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Desbloquear</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onBlock(user)}
                                >
                                  <Lock size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Bloquear</TooltipContent>
                            </Tooltip>
                          )}
                        </>
                      )}

                      {/* Activar/Desactivar (solo admins) */}
                      {canActivateDeactivate(user) && (
                        <>
                          {user.accountStatus === "ACTIVE" ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDeactivate(user)}
                                >
                                  <ToggleLeft size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Desactivar</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onActivate(user)}
                                >
                                  <ToggleRight size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Activar</TooltipContent>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

