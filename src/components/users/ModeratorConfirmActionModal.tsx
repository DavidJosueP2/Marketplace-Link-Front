import { X, AlertTriangle, CheckCircle, Ban, Unlock, UserX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import type { UserResponse } from "@/services/users/types";

interface ModeratorConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  moderator: UserResponse | null;
  action: "block" | "unblock" | "activate" | "deactivate";
  isLoading: boolean;
}

export default function ModeratorConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  moderator,
  action,
  isLoading,
}: ModeratorConfirmActionModalProps) {
  if (!isOpen || !moderator) return null;

  const actionConfig = {
    block: {
      title: "Bloquear Moderador",
      description: `¿Estás seguro de que deseas bloquear a ${moderator.fullName}?`,
      warning: "El moderador no podrá acceder al sistema mientras esté bloqueado.",
      icon: <Ban size={48} className="text-red-600" />,
      confirmText: "Bloquear",
      confirmClass: "bg-red-600 hover:bg-red-700",
    },
    unblock: {
      title: "Desbloquear Moderador",
      description: `¿Deseas desbloquear a ${moderator.fullName}?`,
      warning: "El moderador podrá volver a acceder al sistema.",
      icon: <Unlock size={48} className="text-green-600" />,
      confirmText: "Desbloquear",
      confirmClass: "bg-green-600 hover:bg-green-700",
    },
    activate: {
      title: "Activar Moderador",
      description: `¿Deseas reactivar a ${moderator.fullName}?`,
      warning: "El moderador podrá volver a operar con normalidad.",
      icon: <RotateCcw size={48} className="text-blue-600" />,
      confirmText: "Activar",
      confirmClass: "bg-blue-600 hover:bg-blue-700",
    },
    deactivate: {
      title: "Desactivar Moderador",
      description: `¿Estás seguro de que deseas desactivar a ${moderator.fullName}?`,
      warning: "El moderador quedará inactivo pero podrá ser reactivado posteriormente.",
      icon: <UserX size={48} className="text-orange-600" />,
      confirmText: "Desactivar",
      confirmClass: "bg-orange-600 hover:bg-orange-700",
    },
  };

  const config = actionConfig[action];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-2xl border border-border">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{config.title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition-colors"
            type="button"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {config.icon}
            <div>
              <p className="text-lg font-semibold mb-2">{config.description}</p>
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  {config.warning}
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
            <p>
              <span className="font-medium">Usuario:</span> {moderator.username}
            </p>
            <p>
              <span className="font-medium">Email:</span> {moderator.email}
            </p>
            <p>
              <span className="font-medium">Estado actual:</span> {moderator.accountStatus}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={config.confirmClass}
          >
            {isLoading ? "Procesando..." : config.confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
