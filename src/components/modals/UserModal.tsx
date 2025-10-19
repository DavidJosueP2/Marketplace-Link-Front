import {
  X,
  Save,
  Loader2,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  UserCircle,
} from "lucide-react";

/**
 * UserModal - Modal para crear o editar usuarios del sistema
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.userToEdit - Usuario a editar (null para crear nuevo)
 * @param {Object} props.formData - Datos del formulario
 * @param {Function} props.onFormChange - Callback para actualizar campos del formulario
 * @param {Function} props.onSubmit - Callback para enviar el formulario
 * @param {boolean} props.isSubmitting - Indica si se está enviando el formulario
 */
const UserModal = ({
  isOpen,
  onClose,
  userToEdit,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const isEditing = !!userToEdit;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      onSubmit();
    }
  };

  const isFormValid = () => {
    return (
      formData.nombre?.trim() &&
      formData.apellido?.trim() &&
      formData.email?.trim() &&
      formData.cedula?.trim() &&
      formData.telefono?.trim() &&
      formData.direccion?.trim() &&
      formData.genero &&
      formData.rol &&
      formData.estado !== undefined
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <UserCircle size={28} />
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6">
          <div className="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre || ""}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50"
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellido || ""}
                    onChange={(e) =>
                      handleInputChange("apellido", e.target.value)
                    }
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50"
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Datos de Contacto */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Mail size={20} className="text-purple-600" />
                Datos de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50"
                    placeholder="usuario@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      value={formData.telefono || ""}
                      onChange={(e) =>
                        handleInputChange("telefono", e.target.value)
                      }
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50"
                      placeholder="+58 412-1234567"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Identificación y Dirección */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                Identificación y Dirección
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Cédula <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cedula || ""}
                    onChange={(e) =>
                      handleInputChange("cedula", e.target.value)
                    }
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50"
                    placeholder="V-12345678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Género <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.genero || ""}
                    onChange={(e) =>
                      handleInputChange("genero", e.target.value)
                    }
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <textarea
                    value={formData.direccion || ""}
                    onChange={(e) =>
                      handleInputChange("direccion", e.target.value)
                    }
                    disabled={isSubmitting}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none disabled:opacity-50"
                    placeholder="Av. Principal, Edificio X, Piso Y"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Configuración del Usuario */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                ⚙️ Configuración del Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.rol || ""}
                    onChange={(e) => handleInputChange("rol", e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50"
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="admin">Administrador</option>
                    <option value="moderador">Moderador</option>
                    <option value="usuario">Usuario</option>
                    <option value="vendedor">Vendedor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Estado de la cuenta
                  </label>
                  <div className="flex items-center gap-3 mt-3">
                    <input
                      type="checkbox"
                      checked={formData.estado || false}
                      onChange={(e) =>
                        handleInputChange("estado", e.target.checked)
                      }
                      disabled={isSubmitting}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {formData.estado
                        ? "✅ Cuenta Activa"
                        : "❌ Cuenta Inactiva"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 border-t dark:border-gray-700 flex gap-3 mt-6 -mx-6 -mb-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {isEditing ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  {isEditing ? "Actualizar Usuario" : "Crear Usuario"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
