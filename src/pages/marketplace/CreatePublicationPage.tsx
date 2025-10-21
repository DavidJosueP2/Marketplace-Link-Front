import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { getUserData } from "@/auth/userStorage";
import publicationService from "@/services/publications/publication.service";
import categoryService from "@/services/categories/category.service";
import type { Category } from "@/services/categories/interfaces/Category";
import type { PublicationCreateRequest } from "@/services/publications/interfaces/PublicationCreateRequest";
import LocationPicker from "@/components/common/LocationPicker";
import ImageUpload from "@/components/common/ImageUpload";
import { Package, MapPin, DollarSign, Clock, Tag, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getTextPrimaryClasses,
  getTextSecondaryClasses,
  getCardWithShadowClasses,
  getBorderClasses,
} from "@/lib/themeHelpers";

interface FormData {
  name: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  workingHours: string;
  categoryId: number;
  useRegisteredLocation: boolean;
}

/**
 * CreatePublicationPage - Página para crear nuevas publicaciones
 * Formulario completo con validaciones, mapa interactivo y upload de imágenes
 */
const CreatePublicationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get theme from layout context
  const context = useOutletContext<{ theme?: "light" | "dark" }>();
  const theme = context?.theme || "light";

  // Theme classes
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);
  const cardClasses = getCardWithShadowClasses(theme);
  const borderClass = getBorderClasses(theme);

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [useRegisteredLocation, setUseRegisteredLocation] = useState(false);
  
  // Get user data from local storage
  const userData = getUserData();
  const registeredLat = userData?.latitude || -1.8312;
  const registeredLng = userData?.longitude || -78.1834;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      latitude: registeredLat,
      longitude: registeredLng,
      useRegisteredLocation: false,
    },
  });

  const selectedLocation = watch(["latitude", "longitude"]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías",
          variant: "destructive",
        });
      }
    };
    loadCategories();
  }, []);

  // Manejar cambio de ubicación del mapa
  const handleLocationChange = (lat: number, lng: number) => {
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  // Manejar uso de ubicación registrada
  const handleUseRegisteredLocation = (checked: boolean) => {
    setUseRegisteredLocation(checked);
    if (checked) {
      setValue("latitude", registeredLat);
      setValue("longitude", registeredLng);
    }
  };

  // Manejar envío del formulario
  const onSubmit = async (data: FormData) => {
    // Validar imágenes
    if (images.length < 1) {
      setFieldErrors({ ...fieldErrors, images: "Debes cargar al menos 1 imagen" });
      return;
    }
    if (images.length > 5) {
      setFieldErrors({ ...fieldErrors, images: "No puedes cargar más de 5 imágenes" });
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const request: PublicationCreateRequest = {
        name: data.name,
        description: data.description,
        price: data.price,
        latitude: data.latitude,
        longitude: data.longitude,
        workingHours: data.workingHours || undefined,
        categoryId: data.categoryId,
        vendorId: user?.id as number,
        images: images,
      };

      const response = await publicationService.create(request);

      toast({
        title: "¡Publicación creada!",
        description: "Tu publicación ha sido creada exitosamente",
      });

      navigate("/marketplace-refactored/mis-productos");
    } catch (error: any) {
      console.error("Error creating publication:", error);

      // Manejar ApiError del interceptor
      const status = error.payload?.status || error.response?.status;
      const errorData = error.payload?.data || error.response?.data;

      // Manejar contenido peligroso detectado (403)
      if (status === 403) {
        console.log("403 Forbidden detected, data:", errorData);
        
        // Guardar mensaje en sessionStorage para mostrarlo en la página de destino
        sessionStorage.setItem("pendingReviewMessage", JSON.stringify({
          title: errorData?.title || "Contenido peligroso detectado",
          detail: errorData?.detail || "Tu publicación ha sido enviada a revisión",
        }));

        // Redirigir a mis productos
        navigate("/marketplace-refactored/mis-productos");
        return;
      }

      // Manejar errores de validación por campo (400 con errors)
      if (status === 400 && errorData?.errors) {
        const errors = errorData.errors;
        setFieldErrors(errors);

        // También mostrar toast con el primer error
        const firstErrorKey = Object.keys(errors)[0];
        toast({
          title: errorData.title || "Error de validación",
          description: errors[firstErrorKey],
          variant: "destructive",
        });
      }
      // Manejar errores generales sin campo específico (400 sin errors, 401, 500, etc)
      else if (errorData) {
        toast({
          title: errorData.title || "Error",
          description: errorData.detail || error.payload?.message || "Ocurrió un error al crear la publicación",
          variant: "destructive",
        });
      }
      // Error de red u otro
      else {
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`${textPrimary} text-3xl font-bold flex items-center gap-2`}>
          <Package className="w-8 h-8 text-[#FF9900]" />
          Nueva Publicación
        </h1>
        <p className={`${textSecondary} text-sm mt-1`}>
          Completa el formulario para publicar tu producto o servicio
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Card Principal */}
        <div className={`${cardClasses} rounded-lg p-6 space-y-6`}>
          {/* Nombre */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium ${textPrimary} mb-2`}>
              Título <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", {
                required: "El título es obligatorio",
                minLength: { value: 5, message: "Mínimo 5 caracteres" },
                maxLength: { value: 100, message: "Máximo 100 caracteres" },
              })}
              type="text"
              id="name"
              className={`w-full px-4 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              } ${errors.name || fieldErrors.name ? "border-red-500" : ""}`}
              placeholder="Ej: Laptop Dell XPS 15"
            />
            {(errors.name || fieldErrors.name) && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.name?.message || fieldErrors.name}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className={`block text-sm font-medium ${textPrimary} mb-2`}>
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", {
                required: "La descripción es obligatoria",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
                maxLength: { value: 1000, message: "Máximo 1000 caracteres" },
              })}
              id="description"
              rows={5}
              className={`w-full px-4 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent resize-none ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              } ${errors.description || fieldErrors.description ? "border-red-500" : ""}`}
              placeholder="Describe tu producto o servicio en detalle..."
            />
            {(errors.description || fieldErrors.description) && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.description?.message || fieldErrors.description}
              </p>
            )}
          </div>

          {/* Grid: Precio y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Precio */}
            <div>
              <label htmlFor="price" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                <DollarSign size={16} className="inline mr-1" />
                Precio <span className="text-red-500">*</span>
              </label>
              <input
                {...register("price", {
                  required: "El precio es obligatorio",
                  min: { value: 0.01, message: "El precio debe ser mayor a 0" },
                })}
                type="number"
                step="0.01"
                id="price"
                className={`w-full px-4 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                } ${errors.price || fieldErrors.price ? "border-red-500" : ""}`}
                placeholder="0.00"
              />
              {(errors.price || fieldErrors.price) && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.price?.message || fieldErrors.price}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="categoryId" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                <Tag size={16} className="inline mr-1" />
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                {...register("categoryId", {
                  required: "La categoría es obligatoria",
                  valueAsNumber: true,
                })}
                id="categoryId"
                className={`w-full px-4 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                } ${errors.categoryId || fieldErrors.categoryId ? "border-red-500" : ""}`}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {(errors.categoryId || fieldErrors.categoryId) && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.categoryId?.message || fieldErrors.categoryId}
                </p>
              )}
            </div>
          </div>

          {/* Horario de atención (opcional) */}
          <div>
            <label htmlFor="workingHours" className={`block text-sm font-medium ${textPrimary} mb-2`}>
              <Clock size={16} className="inline mr-1" />
              Horario de atención (opcional)
            </label>
            <input
              {...register("workingHours")}
              type="text"
              id="workingHours"
              className={`w-full px-4 py-2 border ${borderClass} rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
              placeholder="Ej: Lun-Vie 9:00-18:00"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className={`${cardClasses} rounded-lg p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${textPrimary} flex items-center gap-2`}>
              <MapPin className="text-[#FF9900]" size={24} />
              Ubicación <span className="text-red-500">*</span>
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegisteredLocation}
                onChange={(e) => handleUseRegisteredLocation(e.target.checked)}
                className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900] rounded"
              />
              <span className={`text-sm ${textSecondary}`}>Usar ubicación registrada</span>
            </label>
          </div>

          {/* Hidden inputs for latitude and longitude */}
          <input type="hidden" {...register("latitude", { required: true, valueAsNumber: true })} />
          <input type="hidden" {...register("longitude", { required: true, valueAsNumber: true })} />

          <LocationPicker
            onLocationChange={handleLocationChange}
            initialLat={selectedLocation[0]}
            initialLng={selectedLocation[1]}
            theme={theme}
          />

          {(fieldErrors.latitude || fieldErrors.longitude) && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldErrors.latitude || fieldErrors.longitude}
            </p>
          )}
        </div>

        {/* Imágenes */}
        <div className={`${cardClasses} rounded-lg p-6 space-y-4`}>
          <h2 className={`text-xl font-semibold ${textPrimary}`}>
            Imágenes <span className="text-red-500">*</span>
          </h2>
          <ImageUpload
            onImagesChange={setImages}
            maxImages={5}
            minImages={1}
            error={fieldErrors.images}
            theme={theme}
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/marketplace-refactored/publications")}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#FF9900] hover:bg-[#FFB84D] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Package size={20} />
                Publicar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePublicationPage;
