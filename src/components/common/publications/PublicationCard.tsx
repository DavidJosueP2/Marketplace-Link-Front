import { Heart } from "lucide-react";
import {
  getCardWithShadowClasses,
  getTextPrimaryClasses,
  getTextSecondaryClasses,
} from "@/lib/themeHelpers";

interface PublicationImage {
  id: number;
  url: string;
}

interface Publication {
  id: number;
  type: "PRODUCT" | "SERVICE";
  name: string;
  price: number;
  availability: "AVAILABLE" | "UNAVAILABLE";
  publicationDate: string;
  image: PublicationImage;
}

interface PublicationCardProps {
  publication: Publication;
  isFavorite?: boolean;
  onView: (publication: Publication) => void;
  onToggleFavorite: (publication: Publication) => void;
  theme: "light" | "dark";
}

const getAvailabilityColor = (availability: string): string => {
  switch (availability) {
    case "AVAILABLE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "UNAVAILABLE":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const getTypeDisplayName = (type: string): string => {
  return type === "PRODUCT" ? "Producto" : "Servicio";
};

const getAvailabilityDisplayName = (availability: string): string => {
  return availability === "AVAILABLE" ? "Disponible" : "No disponible";
};

const PublicationCard = ({
  publication,
  isFavorite = false,
  onView,
  onToggleFavorite,
  theme,
}: PublicationCardProps) => {
  const cardClasses = getCardWithShadowClasses(theme);
  const textPrimary = getTextPrimaryClasses(theme);
  const textSecondary = getTextSecondaryClasses(theme);

  // Construct image URL from backend
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const imageFileName = publication.image.url;
  // Remove leading slash if present to avoid double slashes
  const cleanFileName = imageFileName.startsWith('/') ? imageFileName.substring(1) : imageFileName;
  const imageUrl = `${baseUrl}/${cleanFileName}`;

  console.log('Publication:', publication.name);
  console.log('Image filename from backend:', imageFileName);
  console.log('Constructed Image URL:', imageUrl);

  return (
    <div
      className={`${cardClasses} rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden group`}
    >
      {/* Image Section */}
      <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={imageUrl}
          alt={publication.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header with title and type */}
        <div className="flex items-start justify-between mb-2">
          <h3
            className={`font-semibold text-lg line-clamp-1 flex-1 ${textPrimary}`}
            title={publication.name}
          >
            {publication.name}
          </h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ml-2 whitespace-nowrap ${
              publication.type === "PRODUCT"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            }`}
          >
            {getTypeDisplayName(publication.type)}
          </span>
        </div>

        {/* Availability status */}
        <div className="mb-3">
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${getAvailabilityColor(publication.availability)}`}
          >
            {getAvailabilityDisplayName(publication.availability)}
          </span>
        </div>

        {/* Price and publication date */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-[#FF9900]">
            ${publication.price.toFixed(2)}
          </span>
          <span className={`text-xs ${textSecondary}`}>
            {publication.publicationDate}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onView(publication)}
            className="flex-1 bg-[#FF9900] hover:bg-[#FFB84D] active:bg-[#CC7A00] text-white font-medium py-2 rounded-lg text-sm transition-all duration-200"
          >
            Ver Detalles
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(publication)}
            className={`px-3 py-2 border-2 rounded-lg transition-all duration-300 ${
              isFavorite
                ? "border-red-500 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              size={18}
              className={isFavorite ? "fill-red-500 text-red-500" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;
