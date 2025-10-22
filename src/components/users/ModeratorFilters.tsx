import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Label } from "@/components/ui/shadcn/label";

interface ModeratorFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchQuery2: string;
  onSearchChange2: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const StatusItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span>{label}</span>
  </div>
);

export default function ModeratorFilters({
  searchQuery,
  onSearchChange,
  searchQuery2,
  onSearchChange2,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}: ModeratorFiltersProps) {
  const hasActiveFilters = searchQuery || searchQuery2 || statusFilter !== "ALL";

  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-muted-foreground" />
        <h3 className="text-lg font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto text-xs"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda 1 - Nombre/Email */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Nombre o Email</Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Búsqueda 2 - Cédula/Usuario */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Cédula o Usuario</Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="text"
              placeholder="Buscar por cédula o usuario..."
              value={searchQuery2}
              onChange={(e) => onSearchChange2(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtro por Estado */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Estado</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los estados</SelectItem>
              <SelectItem value="ACTIVE">
                <StatusItem color="bg-green-500" label="Activos" />
              </SelectItem>
              <SelectItem value="INACTIVE">
                <StatusItem color="bg-gray-500" label="Inactivos" />
              </SelectItem>
              <SelectItem value="BLOCKED">
                <StatusItem color="bg-red-500" label="Bloqueados" />
              </SelectItem>
              <SelectItem value="PENDING_VERIFICATION">
                <StatusItem color="bg-yellow-500" label="Pendientes" />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
