import type { ColumnDef } from "@tanstack/react-table";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { JSX } from "react";
import type { IncidenceDetailResponse } from "../types/d.types";
import { Badge } from "@/components/ui/shadcn/badge";

export const columns: ColumnDef<IncidenceDetailResponse>[] = [
  {
    accessorKey: "incidence_id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
        #{row.original.incidence_id.substring(0, 8)}
      </span>
    ),
  },
  {
    accessorKey: "publication",
    header: "Publicación",
    cell: ({ row }) => (
      <span className="font-medium text-blue-600 dark:text-blue-400">
        {row.original.publication.name}
      </span>
    ),
  },

  // Estado TODOS LOS DE LA INCIDENCIA
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusMap: Record<string, { label: string; className: string }> = {
        OPEN: {
          label: "Abierta",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        },
        PENDING_REVIEW: {
          label: "Pendiente de revisión",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        UNDER_REVIEW: {
          label: "En revisión",
          className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        },
        APPEALED: {
          label: "Apelada",
          className:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        },
        RESOLVED: {
          label: "Resuelta",
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

  // Decisión (APPROVED, REJECTED, PENDING).
  {
    accessorKey: "incidence_decision",
    header: "Decisión",
    cell: ({ row }) => {
      const decision = row.original.incidence_decision;

      const colorMap: Record<string, string> = {
        APPROVED:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        PENDING:
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      };

      const iconMap: Record<string, JSX.Element> = {
        APPROVED: <CheckCircle className="w-3 h-3" />,
        REJECTED: <XCircle className="w-3 h-3" />,
        PENDING: <Clock className="w-3 h-3" />,
      };

      const labelMap: Record<string, string> = {
        APPROVED: "Aprobada",
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
