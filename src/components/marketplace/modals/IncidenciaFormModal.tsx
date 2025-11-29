import { useState, useEffect } from "react";
import { AlertCircle, FileText } from "lucide-react";
import { Modal } from "../common";

const TIPO_INCIDENCIA = [
  { value: "Producto Defectuoso", label: "🔨 Producto Defectuoso" },
  { value: "No Entregado", label: "📦 No Entregado" },
  { value: "No Coincide Descripción", label: "📝 No Coincide Descripción" },
  { value: "Fraudulento", label: "⚠️ Fraudulento" },
  { value: "Otro", label: "❓ Otro" },
];

const IncidenciaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  productos = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    tipo: "Producto Defectuoso",
    productoId: productos[0]?.id || "",
    descripcion: "",
    prioridad: "Media",
  });

  useEffect(() => {
    if (productos.length > 0 && !formData.productoId) {
      setFormData((prev) => ({
        ...prev,
        productoId: productos[0].id,
      }));
    }
  }, [productos, formData.productoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.tipo && formData.productoId && formData.descripcion) {
      onSubmit(formData);
      setFormData({
        tipo: "Producto Defectuoso",
        productoId: productos[0]?.id || "",
        descripcion: "",
        prioridad: "Media",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reportar Incidencia"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alert */}
        <div className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Por favor describe el problema detalladamente para ayudarnos a
            resolverlo.
          </p>
        </div>

        {/* Tipo de Incidencia */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Tipo de Incidencia *
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TIPO_INCIDENCIA.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Producto */}
        {productos.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Producto *
            </label>
            <select
              name="productoId"
              value={formData.productoId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Prioridad
          </label>
          <select
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Descripción Detallada *
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe el problema con detalle. ¿Qué pasó? ¿Cuándo ocurrió? ¿Qué evidencia tienes?"
            required
            rows="4"
            minLength="20"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Mínimo 20 caracteres
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              isLoading ||
              !formData.descripcion ||
              formData.descripcion.length < 20
            }
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Reportar Incidencia
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IncidenciaFormModal;
