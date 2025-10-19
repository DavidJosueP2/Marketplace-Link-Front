import {
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageSquare,
} from "lucide-react";
import {
  getPrioridadColor,
  getEstadoColor,
  formatDateTime,
} from "../../../lib/marketplaceUtils";

const IncidenciaCard = ({
  incidencia,
  onView,
  onApprove,
  onReject,
  showActions = true,
}) => {
  const getPrioridadIcon = () => {
    switch (incidencia.prioridad) {
      case "crítica":
        return (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        );
      case "alta":
        return (
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        );
      case "media":
        return (
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      default:
        return (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
    }
  };

  const getEstadoIcon = () => {
    switch (incidencia.estado) {
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "en_revision":
        return <AlertCircle className="w-4 h-4" />;
      case "resuelta":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all p-5 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">{getPrioridadIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
              {incidencia.producto}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vendedor:{" "}
              <span className="font-medium">{incidencia.vendedor}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadColor(incidencia.prioridad)} whitespace-nowrap`}
          >
            {incidencia.prioridad.toUpperCase()}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getEstadoColor(incidencia.estado)} whitespace-nowrap`}
          >
            {getEstadoIcon()}
            {incidencia.estado.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      {/* Type and Date */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 text-sm">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Tipo</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {incidencia.tipo}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Fecha</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatDateTime(incidencia.fecha)}
          </p>
        </div>
        {incidencia.moderador && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Moderador
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {incidencia.moderador}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
        {incidencia.descripcion}
      </p>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <button
            onClick={() => onView(incidencia)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            Ver
          </button>

          {incidencia.estado === "pendiente" && (
            <>
              <button
                onClick={() => onApprove(incidencia)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Aprobar
              </button>
              <button
                onClick={() => onReject(incidencia)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                Rechazar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default IncidenciaCard;
