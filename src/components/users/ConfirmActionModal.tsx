import { Ban, UserX, Unlock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import type { UserResponse } from "@/services/users/types";
import roleService from "@/services/roles/role.service.ts";

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
    description: "bloquear",
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
    description: "desbloquear",
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
    description: "activar",
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
    description: "desactivar",
    warningText: "El usuario no podrá acceder al sistema. Podrás reactivarlo más adelante, pero sus publicaciones se eliminarán de forma permanente.",
    buttonText: "Sí, Desactivar",
    buttonClass: "bg-red-600 hover:bg-red-700",
    loadingText: "Desactivando...",
  },
};

const isModerator = (user: UserResponse) =>
  Array.isArray(user.roles) &&
  user.roles.some((r: any) =>
    (typeof r === "string" ? r : r.name) === roleService.getRoleModerator()
  );

const MODERATOR_WARNINGS = {
  block: "El moderador no podrá acceder. Sus incidencias se reasignarán y su trabajo en curso se perderá. Acción reversible.",
  deactivate: "Podrás reactivar la cuenta más adelante, pero sus incidencias se reasignarán y su trabajo previo se perderá de forma permanente.",
} as const;

export default function ConfirmActionModal({
                                             isOpen,
                                             onClose,
                                             onConfirm,
                                             user,
                                             action,
                                             isLoading,
                                           }: Readonly<ConfirmActionModalProps>) {
  if (!isOpen || !user) return null;

  const base = ACTION_CONFIG[action];
  const moderator = isModerator(user);
  const warningText =
    moderator && (action === "block" || action === "deactivate")
      ? MODERATOR_WARNINGS[action]
      : base.warningText;
  const Icon = base.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-2xl border border-border">
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className={`${base.iconBg} p-3 rounded-full`}>
              <Icon className={base.iconColor} size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-2">{base.title}</h2>
          <p className="text-center text-muted-foreground mb-6">
            Estás a punto de {base.description} al usuario <br />
            <span className="font-semibold text-foreground">{user.fullName}</span>
            <br />
            <span className="text-sm">({user.email})</span>
          </p>
          <div
            className={`${base.iconBg.replace("100", "50").replace("950", "950/30")} border ${base.iconColor
              .replace("600", "200")
              .replace("400", "800")
              .replace("text-", "border-")} rounded-lg p-4 mb-6`}
          >
            <p
              className={`text-sm ${base.iconColor
                .replace("600", "900")
                .replace("400", "200")}`}
            >
              <strong>Advertencia:</strong> {warningText}
            </p>
          </div>
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
              className={`flex-1 ${base.buttonClass} text-white`}
            >
              {isLoading ? base.loadingText : base.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
