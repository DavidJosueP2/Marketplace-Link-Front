import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { getRolColor, formatDate } from "../../../lib/marketplaceUtils";

const UserCard = ({
  usuario,
  onEdit,
  onDelete,
  onToggleStatus,
  isDeleting = false,
  showActions = true,
}) => {
  const getInitials = () => {
    return (
      usuario.nombre.charAt(0) + usuario.apellido.charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all p-4 border border-gray-200 dark:border-gray-700">
      {/* User Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{getInitials()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {usuario.nombre} {usuario.apellido}
          </h4>
          <span
            className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}
          >
            {usuario.rol}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              usuario.estado === "activo"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {usuario.estado === "activo" ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4 flex-shrink-0 text-blue-500" />
          <a
            href={`mailto:${usuario.email}`}
            className="truncate hover:text-blue-500"
          >
            {usuario.email}
          </a>
        </div>
        {usuario.telefono && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4 flex-shrink-0 text-green-500" />
            <a
              href={`tel:${usuario.telefono}`}
              className="truncate hover:text-green-500"
            >
              {usuario.telefono}
            </a>
          </div>
        )}
        {usuario.direccion && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span className="truncate">{usuario.direccion}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 flex-shrink-0 text-purple-500" />
          <span>Registro: {formatDate(usuario.fechaRegistro)}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <p className="text-gray-500 dark:text-gray-400">Género</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {usuario.genero}
          </p>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <p className="text-gray-500 dark:text-gray-400">Cédula</p>
          <p className="font-medium text-gray-900 dark:text-white font-mono">
            {usuario.cedula}
          </p>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(usuario)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>

          <button
            onClick={() => onToggleStatus(usuario)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-sm font-medium"
            title={
              usuario.estado === "activo"
                ? "Desactivar usuario"
                : "Activar usuario"
            }
          >
            {usuario.estado === "activo" ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => onDelete(usuario)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
