import { useState } from "react";
import {
  Upload,
  Plus,
  X,
  Package,
  DollarSign,
  Tag,
  FileText,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";

interface ImagePreview {
  file: File;
  preview: string;
}

interface FormData {
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  stock: string;
  imagenes: File[];
}

interface FormErrors {
  [key: string]: string | null;
}

interface ProductData extends Omit<FormData, "imagenes"> {
  imagenes: File[];
}

interface PublicarPageProps {
  onSubmit: (data: ProductData) => void;
  isSubmitting?: boolean;
  categorias?: string[];
}

const PublicarPage = ({
  onSubmit,
  isSubmitting = false,
  categorias = [],
}: PublicarPageProps) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
    imagenes: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limitar a 5 imágenes
    if (imagePreviews.length + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Máximo 5 imágenes permitidas",
      }));
      return;
    }

    // Crear previews
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [
          ...prev,
          { file, preview: reader.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    }

    setErrors((prev) => ({ ...prev, imagenes: null }));
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion =
        "La descripción debe tener al menos 10 caracteres";
    }

    if (!formData.precio || Number.parseFloat(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.categoria) {
      newErrors.categoria = "Selecciona una categoría";
    }

    if (!formData.stock || Number.parseInt(formData.stock, 10) < 0) {
      newErrors.stock = "El stock debe ser 0 o mayor";
    }

    if (imagePreviews.length === 0) {
      newErrors.imagenes = "Debes subir al menos una imagen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const productData: ProductData = {
        ...formData,
        imagenes: imagePreviews.map((img) => img.file),
      };
      onSubmit(productData);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      stock: "",
      imagenes: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Package className="w-8 h-8 text-blue-500" />
          Publicar Producto
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Completa la información del producto que deseas publicar
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información Básica
          </h2>

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre-producto" className="block text-sm font-medium mb-2">
                Nombre del Producto *
              </label>
              <input
                id="nombre-producto"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ej: iPhone 15 Pro Max"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${
                  errors.nombre
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion-producto" className="block text-sm font-medium mb-2">
                Descripción *
              </label>
              <textarea
                id="descripcion-producto"
                value={formData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                placeholder="Describe tu producto con el mayor detalle posible..."
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 resize-none ${
                  errors.descripcion
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.descripcion ? (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.descripcion}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {formData.descripcion.length} caracteres
                  </p>
                )}
              </div>
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Precio */}
              <div>
                <label htmlFor="precio-producto" className="block text-sm font-medium mb-2">
                  Precio (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="precio-producto"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => handleChange("precio", e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${
                      errors.precio
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </div>
                {errors.precio && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.precio}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock-producto" className="block text-sm font-medium mb-2">
                  Stock Disponible *
                </label>
                <input
                  id="stock-producto"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${
                    errors.stock
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="categoria-producto" className="block text-sm font-medium mb-2">
                Categoría *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  id="categoria-producto"
                  value={formData.categoria}
                  onChange={(e) => handleChange("categoria", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${
                    errors.categoria
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {errors.categoria && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.categoria}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imágenes del Producto
          </h2>

          <div className="space-y-4">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                errors.imagenes
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Máximo 5 imágenes • PNG, JPG hasta 5MB cada una
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <Plus className="w-4 h-4" />
                Seleccionar Imágenes
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imagePreviews.length >= 5}
                />
              </label>
            </div>

            {errors.imagenes && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.imagenes}
              </p>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {imagePreviews.map((img, index) => (
                  <div key={`preview-${img.file.name}-${index}`} className="relative group">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Publicar Producto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicarPage;
