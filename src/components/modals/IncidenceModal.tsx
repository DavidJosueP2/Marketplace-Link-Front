import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

/**
 * IncidenceModal - Modal para visualizar detalles de una incidencia reportada
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.incidence - Datos de la incidencia
 * @param {Function} props.onApprove - Callback para aprobar la incidencia
 * @param {Function} props.onReject - Callback para rechazar la incidencia
 * @param {Function} props.onAppeal - Callback para abrir modal de apelación
 * @param {boolean} props.canModerate - Indica si el usuario puede moderar (aprobar/rechazar)
 * @param {boolean} props.canAppeal - Indica si el usuario puede apelar
 */
const IncidenceModal = ({
  isOpen,
  onClose,
  incidence,
  onApprove,
  onReject,
  onAppeal,
  canModerate = false,
  canAppeal = false,
}) => {
  if (!isOpen || !incidence) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusConfig = (estado) => {
    const configs = {
      pendiente: {
        icon: Clock,
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        textColor: "text-yellow-700 dark:text-yellow-300",
        borderColor: "border-yellow-300 dark:border-yellow-700",
        label: "Pendiente",
      },
      aprobado: {
        icon: CheckCircle,
        bgColor: "bg-green-100 dark:bg-green-900",
        textColor: "text-green-700 dark:text-green-300",
        borderColor: "border-green-300 dark:border-green-700",
        label: "Aprobado",
      },
      rechazado: {
        icon: XCircle,
        bgColor: "bg-red-100 dark:bg-red-900",
        textColor: "text-red-700 dark:text-red-300",
        borderColor: "border-red-300 dark:border-red-700",
        label: "Rechazado",
      },
    };
    return configs[estado] || configs.pendiente;
  };

  const statusConfig = getStatusConfig(incidence.estado);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              📋 Detalles de Incidencia
            </h2>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} font-medium`}
            >
              <StatusIcon size={16} />
              {statusConfig.label}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información del producto reportado */}
          {incidence.producto && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                📦 Producto Reportado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Nombre
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {incidence.producto.nombre}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Categoría
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {incidence.producto.categoria}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Precio
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${incidence.producto.precio}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Stock
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {incidence.producto.stock} unidades
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Motivo del reporte */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="text-orange-600" size={20} />
              Motivo del Reporte
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white font-medium">
                {incidence.motivo}
              </p>
            </div>
          </div>

          {/* Descripción del problema */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              📝 Descripción del Problema
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {incidence.descripcion || "Sin descripción adicional"}
              </p>
            </div>
          </div>

          {/* Información del reportante */}
          {incidence.usuario && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Reportado por
              </h3>
              <p className="text-gray-900 dark:text-white">
                {incidence.usuario.nombre} {incidence.usuario.apellido}
              </p>
              {incidence.fecha_creacion && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(incidence.fecha_creacion).toLocaleString("es-ES")}
                </p>
              )}
            </div>
          )}

          {/* Apelación (si existe) */}
          {incidence.apelacion && (
            <div
              className={`rounded-lg p-5 border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                <MessageSquare size={20} />
                Apelación
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {incidence.apelacion}
              </p>
              {incidence.fecha_apelacion && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Fecha:{" "}
                  {new Date(incidence.fecha_apelacion).toLocaleString("es-ES")}
                </p>
              )}
            </div>
          )}

          {/* Footer con acciones */}
          <div className="pt-4 border-t dark:border-gray-700">
            {canModerate && incidence.estado === "pendiente" && (
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() => onReject(incidence)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <XCircle size={20} />
                  Rechazar Incidencia
                </button>
                <button
                  onClick={() => onApprove(incidence)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <CheckCircle size={20} />
                  Aprobar Incidencia
                </button>
              </div>
            )}

            {canAppeal &&
              incidence.estado === "rechazado" &&
              !incidence.apelacion && (
                <button
                  onClick={() => onAppeal(incidence)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl mb-3"
                >
                  <MessageSquare size={20} />
                  Presentar Apelación
                </button>
              )}

            <button
              onClick={onClose}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidenceModal;
