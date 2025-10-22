import { Ban, UserX, Unlock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import type { UserResponse } from "@/services/users/types";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: UserResponse | null;
  action: "block" | "unblock" | "activate" | "deactivate";
  isLoading: boolean;
}

const ACTION_CONFIG = {
  block: {
    title: "¿Bloquear Usuario?",
    icon: Ban,
    iconBg: "bg-orange-100 dark:bg-orange-950",
    iconColor: "text-orange-600 dark:text-orange-400",
    description: "bloqueado",
    warningText: "El usuario no podrá acceder al sistema mientras esté bloqueado. Esta acción es reversible.",
    buttonText: "Sí, Bloquear",
    buttonClass: "bg-orange-600 hover:bg-orange-700",
    loadingText: "Bloqueando...",
  },
  unblock: {
    title: "¿Desbloquear Usuario?",
    icon: Unlock,
    iconBg: "bg-green-100 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
    description: "desbloqueado",
    warningText: "El usuario podrá acceder al sistema nuevamente. Se le enviará una notificación.",
    buttonText: "Sí, Desbloquear",
    buttonClass: "bg-green-600 hover:bg-green-700",
    loadingText: "Desbloqueando...",
  },
  activate: {
    title: "¿Activar Usuario?",
    icon: RotateCcw,
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    description: "activado",
    warningText: "El usuario podrá acceder al sistema nuevamente y realizar todas sus actividades.",
    buttonText: "Sí, Activar",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
    loadingText: "Activando...",
  },
  deactivate: {
    title: "¿Desactivar Usuario?",
    icon: UserX,
    iconBg: "bg-red-100 dark:bg-red-950",
    iconColor: "text-red-600 dark:text-red-400",
    description: "desactivado",
    warningText: "El usuario no podrá acceder al sistema. Esta acción es reversible y podrás reactivar al usuario más tarde.",
    buttonText: "Sí, Desactivar",
    buttonClass: "bg-red-600 hover:bg-red-700",
    loadingText: "Desactivando...",
  },
};

export default function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  action,
  isLoading,
}: ConfirmActionModalProps) {
  if (!isOpen || !user) return null;

  const config = ACTION_CONFIG[action];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-2xl border border-border">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`${config.iconBg} p-3 rounded-full`}>
              <Icon className={config.iconColor} size={32} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-2">
            {config.title}
          </h2>

          {/* Description */}
          <p className="text-center text-muted-foreground mb-6">
            Estás a punto de {config.description.split(" ")[0]} al usuario{" "}
            <span className="font-semibold text-foreground">{user.fullName}</span>
            <br />
            <span className="text-sm">({user.email})</span>
          </p>

          <div className={`${config.iconBg.replace("100", "50").replace("950", "950/30")} border ${config.iconColor.replace("600", "200").replace("400", "800").replace("text-", "border-")} rounded-lg p-4 mb-6`}>
            <p className={`text-sm ${config.iconColor.replace("600", "900").replace("400", "200")}`}>
              <strong>Advertencia:</strong> {config.warningText}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 ${config.buttonClass} text-white`}
            >
              {isLoading ? config.loadingText : config.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

