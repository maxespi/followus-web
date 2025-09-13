# TaskSocket Real-Time Communication Reference

## Arquitectura del Sistema

### Proxy Reverso
El sistema utiliza un proxy reverso que maneja todas las comunicaciones WebSocket:

```
Frontend → Puerto 80/443 → Proxy Reverso → Socket2 (Puerto 3002)
```

**IMPORTANTE**: El frontend NUNCA debe conectarse directamente al puerto 3002. Todas las conexiones deben realizarse a través del proxy reverso.

## Configuración de Conexión

### URLs de Conexión

#### Desarrollo (Local)
```javascript
const SOCKET_URL = 'ws://localhost/socket2';
// o
const SOCKET_URL = 'ws://127.0.0.1/socket2';
```

#### Producción
```javascript
const SOCKET_URL = 'wss://tu-dominio.com/socket2';
```

### Variables de Entorno Recomendadas

```javascript
// .env.development
VITE_SOCKET_TASK_URL=ws://localhost/socket2

// .env.production  
VITE_SOCKET_TASK_URL=wss://tu-dominio.com/socket2
```

### Implementación Recomendada

```javascript
const getSocketURL = () => {
  if (import.meta.env.DEV) {
    return 'ws://localhost/socket2';
  }
  return `wss://${window.location.host}/socket2`;
};

const socket = io(getSocketURL());
```

## Configuración de Socket.IO Client

### Configuración Básica
```javascript
import { io } from 'socket.io-client';

const socket = io(getSocketURL(), {
  path: '/socket2',
  transports: ['websocket', 'polling'], // Fallback si WebSocket falla
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});
```

### Configuración Avanzada
```javascript
const socket = io(getSocketURL(), {
  path: '/socket2',
  autoConnect: true,
  forceNew: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  maxReconnectionAttempts: 5,
  timeout: 20000,
  // Configuración específica para proxy
  upgrade: true,
  rememberUpgrade: false
});
```

## Eventos Disponibles

### Eventos que el Frontend EMITE al Backend

```javascript
// Notificar actualización de tarea
socket.emit('taskUpdated', data);

// Notificar eliminación de tarea  
socket.emit('taskDeleted', data);

// Notificar nuevo comentario
socket.emit('taskCommented', data);
```

### Eventos que el Frontend ESCUCHA del Backend

```javascript
// Tarea actualizada por otro usuario
socket.on('taskUpdated', (data) => {
  // Actualizar tarea en estado local
  // CONTEXTO FALTANTE: Estructura exacta de 'data'
});

// Tarea eliminada por otro usuario
socket.on('taskDeleted', (data) => {
  // Remover tarea del estado local
  // CONTEXTO FALTANTE: Estructura exacta de 'data'
});

// Nuevo comentario en tarea
socket.on('taskCommented', (data) => {
  // Actualizar comentarios en tiempo real
  // CONTEXTO FALTANTE: Estructura exacta de 'data'
});
```

## Estructura de Datos (Contexto Parcial)

**NOTA**: Las estructuras exactas del objeto `data` requieren contexto adicional del frontend. Se recomienda definir interfaces TypeScript basadas en las necesidades específicas.

### Estructura Sugerida para taskUpdated
```typescript
interface TaskUpdatedData {
  taskId: number;
  userId: number; // Usuario que hizo la modificación
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  timestamp: string;
  // CONTEXTO FALTANTE: Campos adicionales según implementación
}
```

### Estructura Sugerida para taskDeleted
```typescript
interface TaskDeletedData {
  taskId: number;
  userId: number; // Usuario que eliminó la tarea
  timestamp: string;
  // CONTEXTO FALTANTE: Campos adicionales según implementación
}
```

### Estructura Sugerida para taskCommented
```typescript
interface TaskCommentedData {
  taskId: number;
  commentId: number;
  userId: number;
  content: string;
  parentId?: number; // Para respuestas anidadas
  timestamp: string;
  // CONTEXTO FALTANTE: Campos adicionales según implementación
}
```

## Patrones de Uso Recomendados

### 1. Inicialización del Socket

```javascript
class TaskSocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    this.socket = io(getSocketURL(), {
      path: '/socket2',
      // configuración...
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Conectado a TaskSocket');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Desconectado de TaskSocket');
    });

    // Eventos de tareas
    this.socket.on('taskUpdated', this.handleTaskUpdated.bind(this));
    this.socket.on('taskDeleted', this.handleTaskDeleted.bind(this));
    this.socket.on('taskCommented', this.handleTaskCommented.bind(this));
  }
}
```

### 2. Emisión de Eventos

```javascript
// Al actualizar una tarea
const emitTaskUpdated = (taskData) => {
  if (socket.connected) {
    socket.emit('taskUpdated', {
      taskId: taskData.id,
      userId: currentUser.id,
      changes: taskData.changes,
      timestamp: new Date().toISOString()
    });
  }
};

// Al eliminar una tarea
const emitTaskDeleted = (taskId) => {
  if (socket.connected) {
    socket.emit('taskDeleted', {
      taskId,
      userId: currentUser.id,
      timestamp: new Date().toISOString()
    });
  }
};

// Al comentar una tarea
const emitTaskCommented = (commentData) => {
  if (socket.connected) {
    socket.emit('taskCommented', {
      taskId: commentData.taskId,
      commentId: commentData.id,
      userId: currentUser.id,
      content: commentData.content,
      timestamp: new Date().toISOString()
    });
  }
};
```

### 3. Manejo de Eventos Entrantes

```javascript
const handleTaskUpdated = (data) => {
  // Evitar bucles: no procesar si el cambio fue hecho por el usuario actual
  if (data.userId === currentUser.id) return;
  
  // Actualizar estado de la aplicación
  updateTaskInState(data.taskId, data.changes);
  
  // Mostrar notificación opcional
  showNotification(`Tarea ${data.taskId} actualizada por otro usuario`);
};

const handleTaskDeleted = (data) => {
  if (data.userId === currentUser.id) return;
  
  // Remover tarea del estado
  removeTaskFromState(data.taskId);
  
  showNotification(`Tarea ${data.taskId} eliminada`);
};

const handleTaskCommented = (data) => {
  if (data.userId === currentUser.id) return;
  
  // Agregar comentario al estado
  addCommentToTask(data.taskId, data);
  
  showNotification(`Nuevo comentario en tarea ${data.taskId}`);
};
```

## Integración con Task API

### Flujo Recomendado

1. **Crear/Actualizar Tarea**:
    - Realizar petición HTTP al API
    - Si exitosa → Emitir evento Socket
    - Manejar respuesta y error

2. **Escuchar Cambios**:
    - Recibir evento Socket
    - Validar que no sea del usuario actual
    - Actualizar UI en tiempo real

### Ejemplo de Integración

```javascript
const updateTask = async (taskId, updates) => {
  try {
    // 1. Actualizar en backend via API
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (response.ok) {
      const updatedTask = await response.json();
      
      // 2. Notificar a otros usuarios via Socket
      socket.emit('taskUpdated', {
        taskId,
        userId: currentUser.id,
        changes: updates,
        timestamp: new Date().toISOString()
      });
      
      // 3. Actualizar estado local
      updateLocalTaskState(updatedTask);
    }
  } catch (error) {
    console.error('Error actualizando tarea:', error);
  }
};
```

## Consideraciones de Seguridad

### Validación de Datos
```javascript
const validateSocketData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!data.taskId || !data.userId) return false;
  if (!data.timestamp) return false;
  return true;
};

socket.on('taskUpdated', (data) => {
  if (!validateSocketData(data)) {
    console.warn('Datos de socket inválidos:', data);
    return;
  }
  // Procesar datos válidos...
});
```

### Filtrado por Permisos
```javascript
// CONTEXTO FALTANTE: Lógica de permisos específica
const hasPermissionToViewTask = (taskId, userId) => {
  // Implementar validación basada en:
  // - Usuario es creador de la tarea
  // - Usuario es participante de la tarea  
  // - Usuario pertenece a la misma empresa
  return true; // Placeholder
};

socket.on('taskUpdated', (data) => {
  if (!hasPermissionToViewTask(data.taskId, currentUser.id)) {
    return; // Ignorar actualizaciones de tareas sin permisos
  }
  handleTaskUpdated(data);
});
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión en Desarrollo
```
Error: websocket error
```
**Solución**: Verificar que se está usando `ws://` y no `wss://` en desarrollo.

#### 2. Error de Conexión en Producción
```
Error: SSL/TLS error
```
**Solución**: Verificar que se está usando `wss://` en producción y certificados válidos.

#### 3. Eventos No Se Reciben
**Posibles causas**:
- Path incorrecto (`/socket2`)
- Proxy reverso no configurado
- Firewall bloqueando WebSocket
- CORS mal configurado

#### 4. Múltiples Conexiones
**Solución**: Implementar singleton pattern para Socket manager.

```javascript
class SocketSingleton {
  constructor() {
    if (SocketSingleton.instance) {
      return SocketSingleton.instance;
    }
    
    this.socket = null;
    SocketSingleton.instance = this;
  }
  
  getSocket() {
    if (!this.socket) {
      this.socket = io(getSocketURL(), {
        path: '/socket2'
      });
    }
    return this.socket;
  }
}
```

### Debug Mode

```javascript
const socket = io(getSocketURL(), {
  path: '/socket2',
  // Habilitar logs en desarrollo
  debug: import.meta.env.DEV
});

// Logs adicionales
socket.onAny((eventName, ...args) => {
  if (import.meta.env.DEV) {
    console.log(`Socket evento: ${eventName}`, args);
  }
});
```

## Configuración del Proxy Reverso

**NOTA**: Esta configuración ya está implementada en el backend. Solo para referencia del desarrollador.

```javascript
// reverseProxy/index.js
app.use(createProxyMiddleware('/socket2', { 
  target: `${backendUrl}:3002`, 
  changeOrigin: true, 
  ws: true, // ✅ WebSocket habilitado
  secure: false 
}));
```

## Variables de Entorno del Backend

```env
# .env backend
URL_BACKEND=http://localhost
# En producción: URL_BACKEND=https://tu-dominio.com
```

## Contexto Faltante

Para completar la implementación, se requiere definir:

1. **Estructura exacta** del objeto `data` para cada evento
2. **Lógica de filtrado** por permisos de usuario/empresa
3. **Gestión de salas** (rooms) si se requiere segmentación
4. **Rate limiting** para prevenir spam de eventos
5. **Persistencia** de eventos para usuarios desconectados
6. **Integración específica** con el estado de la aplicación frontend

Se recomienda crear interfaces TypeScript específicas basadas en los modelos documentados en `Task_DataTypes_Reference.md`.
