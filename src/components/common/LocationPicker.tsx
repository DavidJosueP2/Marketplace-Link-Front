import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Crosshair } from "lucide-react";

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  theme?: "light" | "dark";
}

/**
 * LocationPicker - Componente de mapa interactivo con Leaflet
 * Permite seleccionar una ubicación haciendo clic en el mapa
 * Muestra un solo marcador que se puede mover
 */
const LocationPicker = ({
  onLocationChange,
  initialLat = -1.8312,
  initialLng = -78.1834,
  theme = "light",
}: LocationPickerProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear el mapa con zoom máximo
    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 15);
    mapRef.current = map;

    // Agregar capa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Crear marcador inicial
    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
    })
      .addTo(map)
      .bindPopup("Ubicación seleccionada")
      .openPopup();

    markerRef.current = marker;

    // Evento cuando se arrastra el marcador
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      setCurrentLocation({ lat: position.lat, lng: position.lng });
      onLocationChange(position.lat, position.lng);
      marker.setPopupContent(`Lat: ${position.lat.toFixed(6)}, Lng: ${position.lng.toFixed(6)}`);
    });

    // Evento de clic en el mapa
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCurrentLocation({ lat, lng });
      onLocationChange(lat, lng);
      marker
        .setPopupContent(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`)
        .openPopup();
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Actualizar posición cuando cambian las props iniciales
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      const newLatLng = L.latLng(initialLat, initialLng);
      markerRef.current.setLatLng(newLatLng);
      mapRef.current.setView(newLatLng, 15);
      setCurrentLocation({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  // Obtener ubicación actual del navegador
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          mapRef.current.setView([lat, lng], 17);
          setCurrentLocation({ lat, lng });
          onLocationChange(lat, lng);
          markerRef.current
            .setPopupContent(`Tu ubicación actual: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
            .openPopup();
        }
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        let errorMessage = "No se pudo obtener tu ubicación.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible. Verifica que tu GPS esté activo.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado. Intenta nuevamente en un lugar con mejor señal.";
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin size={16} />
          <span>
            Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Crosshair size={16} />
          Usar ubicación actual
        </button>
      </div>

      <div
        ref={mapContainerRef}
        className={`h-[400px] w-full rounded-lg border-2 ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
        style={{ zIndex: 1 }}
      />

      <p className="text-xs text-gray-500 dark:text-gray-400">
        💡 Haz clic en el mapa para seleccionar una ubicación, o arrastra el marcador
      </p>
    </div>
  );
};

export default LocationPicker;
