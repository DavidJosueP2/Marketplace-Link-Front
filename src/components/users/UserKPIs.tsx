import { Users, UserCheck, UserX, ShoppingCart, Store } from "lucide-react";
import type { UserResponse } from "@/services/users/types";

interface UserKPIsProps {
  users: UserResponse[];
}

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  description?: string;
}

function KPICard({ icon, label, value, bgColor, iconColor, description }: KPICardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={`${bgColor} ${iconColor} p-4 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function UserKPIs({ users }: UserKPIsProps) {
  // Calcular estadísticas (sin moderadores)
  const stats = {
    total: users.length,
    active: users.filter(u => u.accountStatus === "ACTIVE").length,
    inactive: users.filter(u => u.accountStatus === "INACTIVE").length,
    blocked: users.filter(u => u.accountStatus === "BLOCKED").length,
    pending: users.filter(u => u.accountStatus === "PENDING_VERIFICATION").length,
    buyers: users.filter(u => u.roles.some(r => r.name === "ROLE_BUYER")).length,
    vendors: users.filter(u => u.roles.some(r => r.name === "ROLE_SELLER")).length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <KPICard
        icon={<Users size={28} />}
        label="Total"
        value={stats.total}
        bgColor="bg-blue-100 dark:bg-blue-950"
        iconColor="text-blue-600 dark:text-blue-400"
        description="Usuarios registrados"
      />

      <KPICard
        icon={<UserCheck size={28} />}
        label="Activos"
        value={stats.active}
        bgColor="bg-green-100 dark:bg-green-950"
        iconColor="text-green-600 dark:text-green-400"
        description="Operando normalmente"
      />

      <KPICard
        icon={<UserX size={28} />}
        label="Inactivos"
        value={stats.inactive}
        bgColor="bg-gray-100 dark:bg-gray-800"
        iconColor="text-gray-600 dark:text-gray-400"
        description="Desactivados"
      />

      <KPICard
        icon={<UserX size={28} />}
        label="Bloqueados"
        value={stats.blocked}
        bgColor="bg-red-100 dark:bg-red-950"
        iconColor="text-red-600 dark:text-red-400"
        description="Por moderación"
      />

      <KPICard
        icon={<ShoppingCart size={28} />}
        label="Compradores"
        value={stats.buyers}
        bgColor="bg-green-100 dark:bg-green-950"
        iconColor="text-green-600 dark:text-green-400"
        description="Rol comprador"
      />

      <KPICard
        icon={<Store size={28} />}
        label="Vendedores"
        value={stats.vendors}
        bgColor="bg-orange-100 dark:bg-orange-950"
        iconColor="text-orange-600 dark:text-orange-400"
        description="Rol vendedor"
      />
    </div>
  );
}

