# 📋 Componentes de Modales - Documentación

Esta carpeta contiene todos los componentes modales de la aplicación, diseñados siguiendo las mejores prácticas de React.

## 🎯 Principios de Diseño

### 1. **Composición y Reutilización**
- Cada modal es un componente independiente y autocontenido
- Props bien definidas para máxima flexibilidad
- Componentes genéricos (como `DeleteConfirmationModal`) reutilizables en múltiples contextos

### 2. **Separación de Responsabilidades**
- Los modales **solo manejan la presentación**
- La lógica de negocio permanece en los hooks personalizados
- Los callbacks permiten comunicación con componentes padres

### 3. **Accesibilidad**
- Backdrop con cierre al hacer clic fuera del modal
- Botones deshabilitados durante operaciones asíncronas
- Labels descriptivos y aria-labels donde es necesario
- Indicadores visuales claros de estado de carga

### 4. **UX/UI Consistente**
- Animaciones suaves de entrada/salida
- Esquema de colores coherente con Tailwind CSS
- Modo oscuro completamente soportado
- Feedback visual inmediato para todas las acciones

---

## 📦 Componentes Disponibles

### 🛒 Modales de Productos

#### `ProductModal`
**Propósito**: Visualizar detalles completos de un producto

**Props**:
```jsx
{
  isOpen: boolean,           // Control de visibilidad
  onClose: Function,         // Callback para cerrar
  product: Object,           // Datos del producto
  isFavorite: boolean,       // Estado de favorito
  onToggleFavorite: Function,// Toggle favoritos
  onReport: Function         // Abrir modal de reporte
}
```

**Características**:
- Muestra información completa del producto
- Integración con favoritos
- Botón rápido para reportar
- Responsive y con scroll interno

---

#### `ProductEditModal`
**Propósito**: Editar información de un producto existente

**Props**:
```jsx
{
  isOpen: boolean,
  onClose: Function,
  formData: Object,          // Datos del formulario
  onFormChange: Function,    // Handler de cambios
  onSubmit: Function,        // Envío del formulario
  isSubmitting: boolean,     // Estado de carga
  categorias: Array          // Lista de categorías
}
```

**Características**:
- Validación en tiempo real
- Campos de precio y stock con tipo numérico
- Selector de categorías dinámico
- Deshabilitación durante envío

---

#### `ProductReportModal`
**Propósito**: Reportar problemas con un producto

**Props**:
```jsx
{
  isOpen: boolean,
  onClose: Function,
  product: Object,
  formData: Object,
  onFormChange: Function,
  onSubmit: Function,
  isSubmitting: boolean,
  motivosReporte: Array      // Lista de motivos predefinidos
}
```

**Características**:
- Resumen del producto reportado
- Selector de motivo de reporte
- Área de descripción detallada
- Avisos informativos sobre el proceso

---

### 📋 Modales de Incidencias

#### `IncidenceModal`
**Propósito**: Visualizar detalles de una incidencia reportada

**Props**:
```jsx
{
  isOpen: boolean,
  onClose: Function,
  incidence: Object,         // Datos de la incidencia
  onApprove: Function,       // Aprobar incidencia
  onReject: Function,        // Rechazar incidencia
  onAppeal: Function,        // Abrir modal de apelación
  canModerate: boolean,      // Permisos de moderación
  canAppeal: boolean         // Puede apelar
}
```

**Características**:
- Estados visuales dinámicos (pendiente/aprobado/rechazado)
- Información del producto y usuario
- Botones de moderación condicionales
- Soporte para apelaciones

---

#### `AppealModal`
**Propósito**: Presentar una apelación sobre incidencia rechazada

**Props**:
```jsx
{
  isOpen: boolean,
  onClose: Function,
  incidence: Object,
  formData: Object,
  onFormChange: Function,
  onSubmit: Function,
  isSubmitting: boolean
}
```

**Características**:
- Resumen de la incidencia rechazada
- Validación de caracteres mínimos (50)
- Contador de caracteres en tiempo real
- Consejos para apelaciones exitosas
- Advertencias sobre uso responsable

---

### 👥 Modales de Usuarios

#### `UserModal`
**Propósito**: Crear o editar usuarios del sistema

**Props**:
```jsx
{
  isOpen: boolean,
  onClose: Function,
  userToEdit: Object | null, // null = crear, objeto = editar
  formData: Object,
  onFormChange: Function,
  onSubmit: Function,
  isSubmitting: boolean
}
```

**Características**:
- Formulario completo con 9 campos
- Secciones organizadas (Personal, Contacto, Identificación, Config)
- Iconos descriptivos para cada sección
- Validación de todos los campos requeridos
- Toggle de estado activo/inactivo
- Selector de roles

---

### 🗑️ Modales Genéricos

#### `DeleteConfirmationModal`
**Propósito**: Modal genérico reutilizable para confirmaciones de eliminación

**Props**:
```jsx
{
  isOpen: boolean,
  onClose: Function,
  onConfirm: Function,
  isDeleting: boolean,
  title: string,             // Título personalizable
  message: string,           // Mensaje principal
  itemName: string,          // Nombre del elemento (opcional)
  warningMessage: string,    // Advertencia adicional
  confirmButtonText: string, // Texto botón confirmar
  cancelButtonText: string   // Texto botón cancelar
}
```

**Características**:
- Completamente parametrizable
- Reutilizable para productos, usuarios, incidencias, etc.
- Icono de advertencia prominente
- Estados de carga integrados

**Ejemplo de uso**:
```jsx
<DeleteConfirmationModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
  isDeleting={isDeleting}
  title="¿Eliminar Usuario?"
  message="Estás a punto de eliminar a"
  itemName="Juan Pérez"
  warningMessage="Se eliminarán todos los datos asociados"
/>
```

---

## 🔧 Uso Recomendado

### Importación
```jsx
// Opción 1: Import individual
import ProductModal from '@/components/modals/ProductModal';

// Opción 2: Import desde index (recomendado)
import { ProductModal, UserModal, DeleteConfirmationModal } from '@/components/modals';
```

### Integración con Hooks
Los modales están diseñados para trabajar con los custom hooks:

```jsx
import { useProductManagement } from '@/hooks/useProductManagement';
import { ProductModal, ProductEditModal } from '@/components/modals';

function MyComponent() {
  const products = useProductManagement();

  return (
    <>
      <ProductModal
        isOpen={products.showProductModal}
        onClose={products.closeProductModal}
        product={products.selectedProduct}
        isFavorite={favoritos.includes(products.selectedProduct?.id)}
        onToggleFavorite={handleToggleFavorite}
        onReport={products.openReporteModal}
      />
      
      <ProductEditModal
        isOpen={products.showEditModal}
        onClose={products.closeEditModal}
        formData={products.editForm}
        onFormChange={products.setEditForm}
        onSubmit={handleSubmitEdit}
        isSubmitting={products.isSubmitting}
        categorias={['Equipos', 'Medicamentos', 'Insumos']}
      />
    </>
  );
}
```

---

## ✅ Checklist de Mejores Prácticas

Cada modal en esta carpeta cumple con:

- ✅ **Props bien tipadas** con JSDoc
- ✅ **Validación de apertura** (`if (!isOpen) return null`)
- ✅ **Backdrop clickable** con handler dedicado
- ✅ **Estados de carga** con spinner y texto dinámico
- ✅ **Deshabilitación de botones** durante operaciones
- ✅ **Animaciones CSS** suaves y no invasivas
- ✅ **Modo oscuro** completamente soportado
- ✅ **Responsive design** con Tailwind CSS
- ✅ **Accesibilidad** con aria-labels y roles semánticos
- ✅ **Separación de lógica** (presentación vs. negocio)

---

## 🎨 Convenciones de Estilo

### Gradientes de Headers
- **Productos**: `from-blue-600 to-indigo-600`
- **Reportes**: `from-red-600 to-orange-600`
- **Incidencias**: `from-purple-600 to-pink-600`
- **Usuarios**: `from-indigo-600 to-purple-600`

### Iconos
Se usa **Lucide React** de forma consistente:
- `X` para cerrar
- `Save` para guardar
- `Loader2` para carga (con `animate-spin`)
- `CheckCircle` para confirmaciones
- `AlertTriangle` para advertencias

### Clases de Animación
```css
animate-fade-in    /* Fade in del backdrop */
animate-scale-in   /* Scale in del modal */
```

---

## 🚀 Próximas Mejoras

1. **Portal Rendering**: Mover modales a un portal de React
2. **Focus Trap**: Implementar trapping de foco para accesibilidad
3. **Keyboard Navigation**: Mejorar navegación con teclado (Esc, Tab)
4. **Stacking**: Soporte para múltiples modales simultáneos
5. **Testing**: Agregar tests unitarios con Testing Library

---

## 📝 Notas de Mantenimiento

- Todos los modales usan el mismo patrón de backdrop
- Los estilos de Tailwind son consistentes en toda la carpeta
- Los cambios a un modal deben seguir el mismo patrón para mantener consistencia
- Documentar nuevas props en JSDoc al agregar funcionalidad

---

**Última actualización**: Octubre 2025
**Autor**: Equipo de Desarrollo Marketplace
