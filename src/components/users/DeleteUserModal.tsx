import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import type { UserResponse } from "@/services/users/types";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: UserResponse | null;
  isDeleting: boolean;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  isDeleting,
}: DeleteUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-2xl border border-border">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-950 p-3 rounded-full">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-2">
            ¿Eliminar Usuario?
          </h2>

          {/* Description */}
          <p className="text-center text-muted-foreground mb-6">
            Estás a punto de eliminar al usuario{" "}
            <span className="font-semibold text-foreground">{user.fullName}</span> (
            <span className="text-sm">{user.email}</span>).
          </p>

          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-900 dark:text-red-200">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. Todos los
              datos asociados a este usuario se eliminarán permanentemente.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

