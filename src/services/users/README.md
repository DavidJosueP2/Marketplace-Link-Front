# Servicio de Gestión de Usuarios

Este módulo contiene todos los servicios, tipos y utilidades para la gestión de usuarios en el marketplace.

## Estructura

```
users/
├── types.ts           # Interfaces y tipos TypeScript
├── users.service.ts   # Servicio HTTP para interactuar con el backend
├── index.ts           # Barrel exports
└── README.md          # Esta documentación
```

## Servicios Disponibles

### `usersService`

Servicio principal para gestionar usuarios mediante la API REST.

#### Métodos

- **`getAll(params?)`**: Obtiene todos los usuarios (solo ADMIN)
- **`getById(userId)`**: Obtiene un usuario por ID
- **`createModerator(data)`**: Crea un nuevo moderador (solo ADMIN)
- **`update(userId, data)`**: Actualiza información de un usuario
- **`activate(userId)`**: Activa un usuario (solo ADMIN)
- **`deactivate(userId)`**: Desactiva un usuario (solo ADMIN)
- **`block(userId)`**: Bloquea un usuario (ADMIN y MODERATOR)
- **`unblock(userId)`**: Desbloquea un usuario (ADMIN y MODERATOR)

## Tipos

### `UserResponse`

Representa un usuario completo devuelto por el backend.

```typescript
interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  cedula: string;
  gender: string;
  accountStatus: string;
  roles: RoleResponse[];
  latitude: number | null;
  longitude: number | null;
}
```

### `ModeratorCreateRequest`

DTO para crear un moderador.

```typescript
interface ModeratorCreateRequest {
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  cedula: string;
  gender: string;
}
```

### `UserUpdateRequest`

DTO para actualizar un usuario (sin datos sensibles).

```typescript
interface UserUpdateRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  cedula?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
}
```

## Helpers

### `getAccountStatusLabel(status: AccountStatus): string`

Convierte un estado de cuenta a su etiqueta en español.

### `getGenderLabel(gender: Gender): string`

Convierte un género a su etiqueta en español.

### `getRoleLabel(roleName: string): string`

Limpia y formatea el nombre de un rol (elimina el prefijo "ROLE_").

### `hasRole(user: UserResponse, roleName: string): boolean`

Verifica si un usuario tiene un rol específico.

## Permisos

### Administrador (ADMIN)
- Puede gestionar todos los usuarios excepto otros admins
- Puede crear moderadores
- Puede activar/desactivar usuarios
- Puede bloquear/desbloquear usuarios
- Puede editar información de usuarios (excepto datos sensibles)

### Moderador (MODERATOR)
- Solo puede gestionar compradores y vendedores
- **NO** puede gestionar moderadores ni admins
- **NO** puede crear moderadores
- Puede bloquear/desbloquear usuarios permitidos
- Puede editar información de usuarios permitidos (excepto datos sensibles)

### Datos Sensibles (No editables por admins/moderadores)
- Email
- Contraseña
- Teléfono

Estos datos solo pueden ser modificados por el propio usuario desde su perfil.

## Uso

```typescript
import { usersService, type UserResponse } from "@/services/users";

// Obtener todos los usuarios
const users = await usersService.getAll();

// Crear un moderador (solo admin)
const moderator = await usersService.createModerator({
  username: "mod_juan",
  email: "juan@example.com",
  phone: "+593987654321",
  firstName: "Juan",
  lastName: "Pérez",
  cedula: "1234567890",
  gender: "MALE",
});

// Actualizar un usuario
const updated = await usersService.update(userId, {
  firstName: "Juan Carlos",
});

// Bloquear un usuario
await usersService.block(userId);
```

## Hooks React Query

Para usar estos servicios en componentes React, utiliza los hooks personalizados:

```typescript
import { useUsers, useCreateModerator, useUpdateUser, useBlockUser } from "@/hooks/users";

function MyComponent() {
  const { data: users, isLoading } = useUsers();
  const createModerator = useCreateModerator();
  const updateUser = useUpdateUser();
  const blockUser = useBlockUser();
  
  // ...
}
```

Ver `/src/hooks/users/` para más detalles sobre los hooks disponibles.

