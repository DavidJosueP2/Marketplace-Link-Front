import type { ColumnDef } from "@tanstack/react-table";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/shadcn/badge";
import type { AppealSimpleDetailsResponse } from "../../incidences/types/d.types";

export const columns: ColumnDef<AppealSimpleDetailsResponse>[] = [
  // ID
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
        #{String(row.original.id).padStart(4, "0")}
      </span>
    ),
  },

  // Seller (usuario que apeló)
  {
    accessorKey: "seller",
    header: "Vendedor",
    cell: ({ row }) => (
      <span className="font-medium text-blue-600 dark:text-blue-400">
        {row.original.seller.fullname}
      </span>
    ),
  },

  // Estado general (status)
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusMap: Record<string, { label: string; className: string }> = {
        PENDING: {
          label: "Pendiente",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        },
        ASSIGNED: {
          label: "Asignada",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        FAILED_NO_MOD: {
          label: "Sin moderador",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        },
        REVIEWED: {
          label: "Revisada",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
      };

      const info = statusMap[status] || {
        label: "Desconocido",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      };

      return (
        <Badge variant="outline" className={info.className}>
          {info.label}
        </Badge>
      );
    },
  },

  // Decisión final (ACCEPTED, REJECTED, PENDING)
  {
    accessorKey: "final_decision",
    header: "Decisión final",
    cell: ({ row }) => {
      const decision = row.original.final_decision;

      const colorMap: Record<string, string> = {
        ACCEPTED:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        PENDING:
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      };

      const iconMap: Record<string, JSX.Element> = {
        ACCEPTED: <CheckCircle className="w-3 h-3" />,
        REJECTED: <XCircle className="w-3 h-3" />,
        PENDING: <Clock className="w-3 h-3" />,
      };

      const labelMap: Record<string, string> = {
        ACCEPTED: "Aceptada",
        REJECTED: "Rechazada",
        PENDING: "Pendiente",
      };

      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[decision]}`}
        >
          {iconMap[decision]}
          {labelMap[decision]}
        </span>
      );
    },
  },

  // Fecha de creación
  {
    accessorKey: "created_at",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <span className="text-sm text-gray-500">
          {date.toLocaleDateString()}{" "}
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
];
