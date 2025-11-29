import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Modal } from "../common";

const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  producto = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "Electrónica",
    disponibilidad: "En Stock",
    ubicacion: "Quito",
    imagen: "",
    vendedor: {
      id: 1,
      nombre: "Vendedor Default",
      avatar: "👤",
    },
  });

  useEffect(() => {
    if (producto) {
      setFormData(producto);
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "Electrónica",
        disponibilidad: "En Stock",
        ubicacion: "Quito",
        imagen: "",
        vendedor: {
          id: 1,
          nombre: "Vendedor Default",
          avatar: "👤",
        },
      });
    }
  }, [producto, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.precio && formData.descripcion) {
      onSubmit(formData);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "Electrónica",
        disponibilidad: "En Stock",
        ubicacion: "Quito",
        imagen: "",
        vendedor: {
          id: 1,
          nombre: "Vendedor Default",
          avatar: "👤",
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={producto ? "Editar Producto" : "Crear Producto"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Laptop Dell XPS 13"
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Descripción *
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe las características del producto..."
            required
            rows="3"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grid: Precio y Categoría */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Precio *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 font-semibold">
                $
              </span>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="0.00"
                required
                step="0.01"
                min="0"
                className="w-full pl-7 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Categoría
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Electrónica</option>
              <option>Deportes</option>
              <option>Videojuegos</option>
              <option>Moda</option>
              <option>Hogar</option>
            </select>
          </div>
        </div>

        {/* Grid: Disponibilidad y Ubicación */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Disponibilidad
            </label>
            <select
              name="disponibilidad"
              value={formData.disponibilidad}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>En Stock</option>
              <option>Agotado</option>
              <option>Descontinuado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Ubicación
            </label>
            <select
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Quito</option>
              <option>Guayaquil</option>
              <option>Cuenca</option>
              <option>Ambato</option>
            </select>
          </div>
        </div>

        {/* Imagen URL */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            URL de Imagen
          </label>
          <input
            type="url"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : producto ? (
              "Actualizar"
            ) : (
              "Crear"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
