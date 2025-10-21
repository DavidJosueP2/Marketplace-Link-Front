# Contexts Guide

Este directorio contiene los React Contexts para gestionar el estado global de la aplicación siguiendo las mejores prácticas.

## 📁 Contexts Implementados

### ✅ FavoritesContext
- **Propósito**: Gestionar los favoritos del usuario
- **Fuente de datos**: Backend API (`/api/users/{id}/favorites`)
- **Hook**: `useFavoritesContext()`
- **Datos expuestos**:
  - `favorites`: Array de publicaciones favoritas
  - `favoritesCount`: Número de favoritos
  - `isLoading`: Estado de carga
  - `error`: Errores
  - `refetch`: Función para refrescar

### ✅ PublicationsContext
- **Propósito**: Gestionar las publicaciones globales
- **Fuente de datos**: Backend API (`/api/publications`)
- **Hook**: `usePublicationsContext()`
- **Datos expuestos**:
  - `publications`: Array de publicaciones
  - `totalPublications`: Número total
  - `isLoading`: Estado de carga
  - `error`: Errores
  - `refetch`: Función para refrescar

## 🔧 Cómo Crear un Nuevo Context

### 1. Crear el archivo del contexto

```typescript
// src/context/MensajesContext.tsx
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import mensajesService from "@/services/mensajes/mensajes.service";

interface MensajesContextValue {
  mensajes: Mensaje[];
  mensajesNoLeidos: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const MensajesContext = createContext<MensajesContextValue | undefined>(
  undefined
);

interface MensajesProviderProps {
  children: ReactNode;
}

export const MensajesProvider = ({ children }: MensajesProviderProps) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["mensajes", "user"],
    queryFn: () => mensajesService.getUserMessages(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  const value: MensajesContextValue = useMemo(
    () => ({
      mensajes: data || [],
      mensajesNoLeidos: data?.filter(m => !m.leido).length || 0,
      isLoading,
      error: error as Error | null,
      refetch,
    }),
    [data, isLoading, error, refetch]
  );

  return (
    <MensajesContext.Provider value={value}>
      {children}
    </MensajesContext.Provider>
  );
};

export const useMensajesContext = () => {
  const context = useContext(MensajesContext);
  if (context === undefined) {
    throw new Error(
      "useMensajesContext must be used within a MensajesProvider"
    );
  }
  return context;
};
```

### 2. Agregar el provider al Layout

```typescript
// src/layouts/marketplace_layout_refactored.tsx

// Import
import { useMensajesContext, MensajesProvider } from "@/context/MensajesContext";

// En MarketplaceLayoutContent (dentro del componente)
const { mensajesNoLeidos } = useMensajesContext();

// En navigationWithBadges useMemo
if (item.id === 'mensajes') {
  badge = mensajesNoLeidos > 0 ? mensajesNoLeidos : null;
}

// Agregar dependencia al useMemo
}, [userRole, favoritesCount, totalPublications, mensajesNoLeidos]);

// En el wrapper MarketplaceLayout
const MarketplaceLayout = () => {
  return (
    <PublicationsProvider>
      <FavoritesProvider>
        <MensajesProvider>
          <MarketplaceLayoutContent />
        </MensajesProvider>
      </FavoritesProvider>
    </PublicationsProvider>
  );
};
```

## 📋 Checklist para Agregar un Context

- [ ] Crear servicio API en `src/services/`
- [ ] Crear interfaces TypeScript
- [ ] Crear Context con Provider en `src/context/`
- [ ] Usar `useMemo` para el value del provider
- [ ] Crear custom hook `useXxxContext()`
- [ ] Agregar Provider al wrapper del Layout
- [ ] Consumir el context en `MarketplaceLayoutContent`
- [ ] Actualizar `navigationWithBadges` para incluir el nuevo badge
- [ ] Agregar el contador a las dependencias del `useMemo`

## 🎯 Mejores Prácticas

1. **Usar React Query**: Todos los contexts que consumen APIs deben usar React Query para cache y sincronización
2. **Memoizar el value**: Usar `useMemo` para evitar re-renders innecesarios
3. **Validación de contexto**: Siempre verificar que el context no sea `undefined` en el hook
4. **StaleTime apropiado**: Configurar según la frecuencia de actualización de los datos
5. **Error handling**: Siempre exponer el estado de error
6. **Loading states**: Exponer estado de carga para UX

## 🚫 Anti-patrones a Evitar

- ❌ No usar datos mock en contexts
- ❌ No poner lógica de negocio compleja en contexts
- ❌ No crear contexts muy grandes (separar responsabilidades)
- ❌ No olvidar agregar el Provider al árbol de componentes
- ❌ No mutar el estado directamente (siempre usar refetch o mutaciones)

## 📊 Contexts Pendientes

Los siguientes contexts deberían implementarse siguiendo este patrón:

- [ ] `MensajesContext` - Mensajes del usuario
- [ ] `IncidenciasContext` - Incidencias reportadas
- [ ] `ReportesContext` - Reportes de moderación
- [ ] `ApelacionesContext` - Apelaciones del usuario
- [ ] `MyPublicationsContext` - Publicaciones propias del vendedor

Una vez implementados, actualizar el `navigationWithBadges` en `marketplace_layout_refactored.tsx`.
