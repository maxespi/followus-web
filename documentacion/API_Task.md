# API COMPLETA HADES ERP - DOCUMENTACIÓN INTEGRAL FRONTEND
**Versión**: 2025-01-13 (Documentación Integral Verificada)
**Módulos**: Autenticación + Tareas + WebSocket
**Estado**: ✅ 100% Funcional y Verificado

---

## 🎯 GUÍA RÁPIDA PARA DESARROLLADORES FRONTEND

### **Flujo Básico de Implementación**:
1. **[Autenticación](#autenticación)** - Login y gestión de usuarios
2. **[Tareas CRUD](#endpoints-principales)** - Dashboard principal de tareas
3. **[Comentarios](#gestión-de-comentarios)** - Sistema de comentarios anidados
4. **[Colaboración](#gestión-de-usuarios)** - Asignación y privilegios
5. **[WebSocket](#websocket-real-time)** - Actualizaciones en tiempo real

### **URLs Base**:
- **Autenticación**: `/api/usuarios`
- **Tareas**: `/api/tasks`
- **WebSocket**: `ws://localhost/socket2` (dev) / `wss://dominio.com/socket2` (prod)

---

## 📋 TABLA DE CONTENIDOS

### **MÓDULO AUTENTICACIÓN**
1. [Autenticación y Login](#autenticación)
2. [Gestión de Contraseñas](#gestión-de-contraseñas)
3. [Gestión de Usuarios](#gestión-de-usuarios-auth)

### **MÓDULO TAREAS**
4. [Endpoints Principales Tareas](#endpoints-principales)
5. [Gestión de Comentarios](#gestión-de-comentarios)
6. [Gestión de Usuarios en Tareas](#gestión-de-usuarios)
7. [Gestión de Archivos](#gestión-de-archivos)
8. [Relaciones entre Tareas](#relaciones-entre-tareas)
9. [Integración con Eventos](#integración-eventos)
10. [Utilidades y Listados](#utilidades)

### **MÓDULO TIEMPO REAL**
11. [WebSocket Real-Time](#websocket-real-time)

### **INFORMACIÓN TÉCNICA**
12. [Tipos de Datos y Modelos](#tipos-de-datos)
13. [Lógica de Negocio](#lógica-de-negocio)
14. [Códigos de Error](#códigos-de-error)

---

# 🔐 MÓDULO AUTENTICACIÓN

## 🔑 AUTENTICACIÓN {#autenticación}

### **Base URL**: `/api/usuarios`
### **Flujo Principal**: Registro → Confirmación → Login → Uso con JWT

### 1. Login de Usuario ⭐
**POST** `/login`

**Descripción**: Endpoint principal para autenticar usuarios y obtener token JWT.

**Body**:
```json
{
  "email": "usuario@empresa.com",
  "password": "contraseña123",
  "from": "web"  // Opcional: "web" o "app"
}
```

**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "el usuario fue autenticado",
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "usuario@empresa.com",
    "rasgosDistintivos": "Alto, Barba, Lentes",
    "dispositivos": [],
    "atribucionDeUsuario": [],
    "atribucionDeGrupos": [],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nivelAcceso": "admin",
    "empresas": [
      {
        "id": 1,
        "nombre": "Empresa ABC"
      }
    ],
    "solicitarCambioPassword": false,
    "fechaCambioPassword": "2024-01-15T10:30:00.000Z"
  }
}
```

**Casos de Error**:
- `404`: Usuario no existe
- `403`: Usuario no confirmado o contraseña incorrecta
- `400`: Usuario sin dispositivo vinculado (si aplica)

**⚠️ Caso de Uso Frontend**:
```javascript
// Verificar si debe cambiar contraseña
if (response.data.solicitarCambioPassword) {
  // Redirigir a cambio de contraseña obligatorio
  router.push('/cambiar-password');
} else {
  // Guardar token y redirigir a dashboard
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  router.push('/dashboard');
}
```

### 2. Registro de Usuario
**POST** `/`

**Body**:
```json
{
  "rut": "12345678-9",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "usuario@empresa.com",
  "password": "contraseña123",
  "telefono": "+56912345678",
  "empresas": [1, 2] // IDs de empresas (requerido)
}
```

**Respuesta**:
```json
{
  "msg": "Usuario creado correctamente, revisa tu email para confirmar cuenta"
}
```

### 3. Confirmar Cuenta
**GET** `/confirmar/:token`

**Parámetros**: `token` (path) - Token de confirmación enviado por email

### 4. Obtener Perfil Actual 🔒
**GET** `/perfil`

**Headers**: `Authorization: Bearer {token}`

**Respuesta**:
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "usuario@empresa.com",
  "telefono": "+56912345678",
  "nivelAcceso": "admin",
  "rasgosDistintivos": "Alto, Barba",
  "dispositivos": [],
  "empresas": [
    {
      "id": 1,
      "nombre": "Empresa ABC"
    }
  ]
}
```

**Caso de Uso Frontend**: Cargar información del usuario en header/perfil.

---

## 🔒 GESTIÓN DE CONTRASEÑAS {#gestión-de-contraseñas}

### 1. Recuperar Contraseña - Solicitud
**POST** `/olvide-password`

**Body**:
```json
{
  "email": "usuario@empresa.com"
}
```

### 2. Recuperar Contraseña - Validar Token
**GET** `/olvide-password/:token`

### 3. Establecer Nueva Contraseña
**POST** `/olvide-password/:token`

**Body**:
```json
{
  "password": "nuevaContraseña123"
}
```

### 4. Cambiar Contraseña (Usuario Autenticado) 🔒
**POST** `/cambiar-password`

**Headers**: `Authorization: Bearer {token}`

**Body**:
```json
{
  "currentPassword": "contraseñaActual",
  "newPassword": "nuevaContraseña123"
}
```

**Respuesta**:
```json
{
  "msg": "Contraseña actualizada exitosamente"
}
```

**⚠️ Importante**: Actualiza automáticamente `solicitarCambioPassword: false`.

---

## 👥 GESTIÓN DE USUARIOS (Admin) {#gestión-de-usuarios-auth}

### 1. Obtener Todos los Usuarios 🔒
**GET** `/usuarios`

### 2. Obtener Usuario por ID 🔒
**GET** `/:id`

### 3. Editar Usuario 🔒
**PUT** `/usuarios/:id`

### 4. Eliminar Usuario 🔒
**DELETE** `/usuarios/:id`

---

# 📋 MÓDULO TAREAS

## 🎯 ENDPOINTS PRINCIPALES TAREAS {#endpoints-principales}

### **Base URL**: `/api/tasks`
### **Autenticación**: Todas las rutas requieren `Authorization: Bearer {token}`

### 1. Obtener Tareas del Usuario ⭐
**GET** `/tasksdelusuario/:id`

**🎯 USO FRONTEND**: Dashboard principal - Lista resumida de tareas
**⚡ PERFORMANCE**: Datos básicos únicamente, SIN comentarios/archivos/relaciones completas

**Descripción**: Endpoint optimizado para listar tareas. Obtiene todas las tareas donde el usuario es creador o participante, pero SOLO con datos básicos para mostrar en listas.

**Parámetros**: `id` (path) - ID del usuario

**Respuesta**:
```json
[
  {
    "id": 1,
    "detalleTask": "Descripción de la tarea",
    "categoria": "Proceso|Calendario|General",
    "estado": "disponible|en_desarrollo|en_revision|archivado",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "sidebar": "left|right|center",
    "clasificacion": "U|P|N|C",
    "vistoPor": [1, 2, 3],
    "fecha_hora_termino": "2024-01-20T18:00:00.000Z",
    "fecha_hora_inicio": "2024-01-15T09:00:00.000Z",
    "fecha_finalizacion": "2024-01-20T17:45:00.000Z",
    "creador": {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez"
    },
    "tasksusuarios": [
      {
        "usuarioId": 2,
        "privilegio": false,
        "rol": "jefe tarea",
        "Usuario": {
          "id": 2,
          "nombre": "María",
          "apellido": "González"
        }
      }
    ]
  }
]
```

**✅ INCLUYE** (datos básicos):
- ✅ Información básica de tarea (id, título, estado, fechas)
- ✅ Creador básico (id, nombre, apellido)
- ✅ Participantes básicos (solo Usuario básico)
- ✅ Control `vistoPor` para notificaciones

**❌ NO INCLUYE** (para performance):
- ❌ Comentarios completos con respuestas
- ❌ Archivos adjuntos
- ❌ Relaciones padre-hija
- ❌ Etapas de proceso
- ❌ Eventos vinculados

**Casos de Uso Frontend**:
- 📋 **Dashboard principal** de tareas
- 🔍 **Filtrado** por estado/categoría
- 👥 **Lista de participantes** básica
- 🔔 **Indicador** de tareas no vistas (`vistoPor`)

### 2. Obtener Notificaciones del Usuario ⭐
**GET** `/notificaciones/:id`

**Descripción**: Para sistema de notificaciones y badges.

**Respuesta**:
```json
[
  {
    "id": 1,
    "detalleTask": "Tarea con comentario nuevo",
    "categoria": "Proceso",
    "sidebar": "right",
    "updatedAt": "2024-01-15T14:30:00.000Z",
    "creador": {
      "id": 3,
      "nombre": "Carlos",
      "apellido": "López"
    },
    "ultimoComentario": {
      "contenido": "Necesito tu revisión urgente",
      "usuario": {
        "id": 4,
        "nombre": "Ana",
        "apellido": "Martín"
      },
      "createdAt": "2024-01-15T14:25:00.000Z"
    },
    "tipoNotificacion": "comment"
  }
]
```

**Lógica de Filtrado**:
- ❌ Tareas ya vistas (`vistoPor` contiene userId)
- ❌ Tareas archivadas
- ❌ Tareas de calendario vencidas (`sidebar: "left"`)
- ✅ Ordenadas por fecha más reciente

**Tipos de Notificación**:
- `"comment"`: Tarea con último comentario
- `"update"`: Tarea modificada sin comentarios

### 3. Obtener Tarea Individual ⭐
**GET** `/:id`

**🎯 USO FRONTEND**: Modal/página de detalle - Datos completos de tarea
**📦 DATOS COMPLETOS**: Incluye TODAS las relaciones y datos asociados

**Descripción**: Endpoint completo para vista detallada. Incluye absolutamente todos los datos relacionados: comentarios anidados, archivos, relaciones, etapas, eventos, etc.

**Respuesta Completa** (incluye todas las relaciones):
```json
{
  "id": 1,
  "clasificacion": "U",
  "fecha_hora_inicio": "2024-01-15T09:00:00.000Z",
  "fecha_hora_termino": "2024-01-20T18:00:00.000Z",
  "fecha_finalizacion": "2024-01-20T17:45:00.000Z",
  "detalleTask": "Descripción detallada",
  "tipo": "revision",
  "latitude": -33.4489,
  "longitude": -70.6693,
  "image": "/uploads/imagen.jpg",
  "video": "/uploads/video.mp4",
  "creadorId": 1,
  "estado": "archivado",
  "categoria": "Proceso",
  "minutos": 120,
  "sidebar": "right",
  "proceso": "Proceso de Revisión",
  "vistoPor": [1, 2],
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-20T17:45:00.000Z",
  "creador": { "id": 1, "nombre": "Juan", "apellido": "Pérez" },
  "tasksusuarios": [...], // 👥 Participantes completos con roles
  "taskscomentarios": [...], // 💬 Comentarios anidados + reacciones
  "tasksetapas": [...], // 📋 Etapas de proceso + atributos
  "files": [...], // 📁 Archivos adjuntos
  "Hijas": [...], // 🔗 Tareas hijas (relaciones)
  "Padres": [...] // 🔗 Tareas padres (relaciones)
}
```

**✅ INCLUYE TODO**:
- ✅ **Datos completos** de la tarea
- ✅ **Comentarios anidados** con respuestas y reacciones
- ✅ **Archivos adjuntos** con URLs
- ✅ **Participantes** con roles y permisos completos
- ✅ **Relaciones** padre-hija con otras tareas
- ✅ **Etapas de proceso** con atributos
- ✅ **Eventos vinculados** (si existen)
- ✅ **Historial completo** de cambios

**Casos de Uso Frontend**:
- 🔍 **Modal de detalle** de tarea
- ✏️ **Formulario de edición** completo
- 💬 **Sistema de comentarios** anidados
- 📁 **Gestión de archivos** adjuntos
- 🔗 **Visualización de relaciones** entre tareas

---

## 🔄 COMPARACIÓN CRÍTICA PARA FRONTEND

| Aspecto | `/tasksdelusuario/:id` (Lista) | `/:id` (Detalle) |
|---------|---------------------------|-------------------|
| **🎯 Propósito** | Dashboard/Lista de tareas | Modal/Detalle completo |
| **⚡ Performance** | ⚡ Optimizado (datos básicos) | 🐌 Pesado (datos completos) |
| **👥 Participantes** | ✅ Básico (id, nombre) | ✅ Completo (roles, permisos) |
| **💬 Comentarios** | ❌ NO incluye | ✅ Anidados + reacciones |
| **📁 Archivos** | ❌ NO incluye | ✅ Lista completa + URLs |
| **🔗 Relaciones** | ❌ NO incluye | ✅ Padres + Hijas |
| **📋 Etapas** | ❌ NO incluye | ✅ Etapas + atributos |
| **🎯 Eventos** | ❌ NO incluye | ✅ Eventos vinculados |
| **🔔 vistoPor** | ✅ Para notificaciones | ✅ Control completo |

**📝 REGLA CRÍTICA**:
- 📋 **Lista**: Usar `/tasksdelusuario/:id` para cargar el dashboard
- 🔍 **Detalle**: Usar `/:id` solo cuando usuario hace clic en tarea específica

---

### 4. Crear Nueva Tarea ⭐
**POST** `/`

**Body**:
```json
{
  "detalleTask": "Descripción de la tarea",
  "categoria": "Proceso",
  "estado": "disponible",
  "sidebar": "right",
  "clasificacion": "U",
  "fecha_hora_inicio": "2024-01-15T09:00:00.000Z",
  "fecha_hora_termino": "2024-01-20T18:00:00.000Z",
  "minutos": 120,
  "proceso": "Proceso de Revisión",
  "latitude": -33.4489,
  "longitude": -70.6693,
  "tipo": "revision"
}
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Tarea ingresado",
  "data": {
    "id": 1,
    "detalleTask": "Descripción de la tarea",
    "vistoPor": [1],
    "createdAt": "2024-01-15T08:00:00.000Z"
  }
}
```

**⚠️ Comportamiento**: `vistoPor` se inicializa automáticamente con `[creadorId]`.

### 5. Actualizar Tarea ⭐
**PUT** `/:id`

**Body** (todos opcionales):
```json
{
  "detalleTask": "Nueva descripción",
  "estado": "en_desarrollo",
  "categoria": "Calendario",
  "fecha_hora_termino": "2024-01-25T18:00:00.000Z"
}
```

**⚠️ Comportamientos Automáticos**:
- **Al marcar `estado: "archivado"`**: Asigna automáticamente `fecha_finalizacion: new Date()`
- **Al cambiar de archivado**: Pone `fecha_finalizacion: null`
- **Resetea vistoPor**: `vistoPor = [req.usuario.id]` (solo quien edita la ha visto)

### 6. Eliminar Tarea
**DELETE** `/:id`

**⚠️ Cascada**: Elimina automáticamente comentarios, archivos, usuarios asignados y relaciones.

### 7. Marcar Tarea como Vista ⭐
**PUT** `/marcar-vista/:id`

**Comportamiento**: Agrega `req.usuario.id` al array `vistoPor` sin duplicados.

**Caso de Uso**: Marcar notificaciones como leídas.

### 8. Marcar Tarea como No Vista
**PUT** `/marcar-no-vista/:id`

**Body Opcional**:
```json
{
  "excludeUserId": 1
}
```

---

## 💬 GESTIÓN DE COMENTARIOS {#gestión-de-comentarios}

### Sistema de Comentarios Anidados

### 1. Crear Comentario ⭐
**POST** `/comentario`

**Body**:
```json
{
  "taskId": 1,
  "detalleTaskComentario": "Mi comentario",
  "clasificacion": "U|P|N|C"
}
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Comentario ingresado",
  "data": {
    "id": 1,
    "detalleTaskComentario": "Mi comentario",
    "taskId": 1,
    "usuarioId": 1,
    "nivel": 0,
    "parentId": null,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "usuario": {
      "id": 1,
      "nombre": "Juan"
    }
  }
}
```

### 2. Responder Comentario (Anidado) ⭐
**POST** `/comentario/responder`

**Body**:
```json
{
  "taskId": 1,
  "parentId": 5,
  "detalleTaskComentario": "Mi respuesta",
  "clasificacion": "N"
}
```

**Sistema de Anidado**:
- `nivel = 0`: Comentario principal
- `nivel = 1+`: Respuestas anidadas
- `parentId`: ID del comentario padre

### 3. Editar Comentario ⭐
**PUT** `/comentario/:id`

**Body**:
```json
{
  "detalleTaskComentario": "Comentario editado"
}
```

**⚠️ Restricciones Implementadas**:
- ✅ **Solo el autor puede editar**
- ✅ **Máximo 1 hora después de creado**
- Validación automática de permisos

### 4. Reaccionar a Comentario ⭐
**POST** `/comentario/reaccion`

**Body**:
```json
{
  "comentarioId": 1,
  "tipoReaccion": "👍"
}
```

**Reacciones Disponibles**: `["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "✅", "❌"]`

**Comportamiento Toggle**:
- Si existe la misma reacción: la elimina
- Si existe diferente reacción: la actualiza
- Si no existe: crea nueva reacción

### 5. Eliminar Comentario
**DELETE** `/comentario/:id`

---

## 👥 GESTIÓN DE USUARIOS EN TAREAS {#gestión-de-usuarios}

### Sistema de Roles y Privilegios

### 1. Asignar Usuario a Tarea ⭐
**POST** `/tasksusuarios`

**Body**:
```json
{
  "taskId": 1,
  "usuarioId": 2,
  "rol": "jefe tarea",
  "clasificacion": "P",
  "fecha_hora_inicio": "2024-01-15T09:00:00.000Z",
  "fecha_hora_termino": "2024-01-20T18:00:00.000Z",
  "detalleUsuario": "Instrucciones específicas",
  "derivado": 0,
  "vista": false
}
```

**Sistema de Roles** (jerarquía por weight):
1. **"superior"** (weight: 1): Jefe superior, dispone o tiene interés
2. **"jefe tarea"** (weight: 2): Responsable de que se cumpla
3. **"subordinado"** (weight: 3): Cumple subtareas a requerimiento
4. **"facilitador"** (weight: 4): Entrega información
5. **"asesor"** (weight: 5): Asesora al jefe
6. **"informado"** (weight: 6): Solo se informa

### 2. Otorgar Privilegios ⭐
**PUT** `/privilegio`

**Body**:
```json
{
  "taskUsuarioId": 1,
  "privilegio": true
}
```

**⚠️ Restricción Crítica**: Solo el **creador** de la tarea puede otorgar privilegios.

**Sistema de Privilegios**:
- **👑 Creador**: Puede hacer TODO (crear, editar, eliminar, privilegios)
- **⭐ Usuario Privilegiado**: Puede editar tarea completa EXCEPTO eliminar
- **👤 Usuario Normal**: Solo puede comentar y ver

### 3. Eliminar Usuario de Tarea
**DELETE** `/tasksusuarios/:id`

**Parámetros**: `id` = ID de la relación TaskUsuario

---

## 📁 GESTIÓN DE ARCHIVOS {#gestión-de-archivos}

### 1. Subir Archivos ⭐
**POST** `/withfiles`

**Content-Type**: `multipart/form-data`
**Límite**: Máximo 10 archivos

**Form Data**:
- `files`: Array de archivos
- `taskId`: ID de la tarea
- `names`: Array de nombres personalizados (opcional)

**Respuesta**:
```json
{
  "success": true,
  "message": "Archivos de tarea ingresados",
  "data": {
    "id": 1,
    "detalleTask": "Tarea con archivos",
    "vistoPor": [1],
    "files": [
      {
        "id": 1,
        "nombre": "documento.pdf",
        "url": "/uploads/task_1/documento_uuid_timestamp.pdf"
      }
    ]
  }
}
```

**⚠️ Comportamiento**: Genera nombres únicos con UUID + timestamp para evitar conflictos.

### 2. Renombrar Archivo
**PUT** `/updateTaskFileName/:id`

**Body**:
```json
{
  "newName": "nuevo_nombre.pdf"
}
```

### 3. Eliminar Archivo
**DELETE** `/withfiles/:id`

**⚠️ Comportamiento**: Elimina archivo físico del servidor + registro de BD.

---

## 🔗 RELACIONES ENTRE TAREAS {#relaciones-entre-tareas}

### Sistema Padre-Hija Completo

### 1. Crear Relación ⭐
**POST** `/relation`

**Body**:
```json
{
  "taskPadreId": 1,
  "taskHijaId": 2
}
```

### 2. Obtener Todas las Relaciones ⭐
**GET** `/relation/related/:id`

**Parámetros**: `id` = ID de la tarea

**Respuesta**:
```json
{
  "padres": [
    {
      "id": 1,
      "detalleTask": "Tarea padre",
      "estado": "disponible"
    }
  ],
  "hijas": [
    {
      "id": 3,
      "detalleTask": "Tarea hija",
      "estado": "en_desarrollo"
    }
  ]
}
```

### 3. Obtener Solo Tareas Hijas
**GET** `/relation/hijas/:id`

### 4. Obtener Solo Tareas Padres
**GET** `/relation/padres/:id`

### 5. Obtener Relación Específica
**GET** `/relation/:id`

**Parámetros**: `id` = ID de la relación TaskToTask

### 6. Actualizar Relación
**PUT** `/relation/:id`

### 7. Eliminar Relación
**DELETE** `/relation/:id`

### 8. Eliminar Todas las Relaciones
**DELETE** `/relation/all/:id`

---

## 🎯 INTEGRACIÓN CON EVENTOS {#integración-eventos}

**ℹ️ Contexto**: Vinculación con el sistema de reportes móviles. Para casos avanzados, consultar **Documentación del Módulo Eventos**.

### 1. Obtener Eventos Disponibles ⭐
**GET** `/getAllEventForTaskInCompany`

**Caso de Uso**: Selector de eventos para vincular con tareas.

**Respuesta**:
```json
[
  {
    "id": 1,
    "clasificacion": "U",
    "fecha_hora_inicio": "2024-01-15T10:00:00.000Z",
    "observaciones": "Incidente reportado",
    "latitude": -33.4489,
    "longitude": -70.6693,
    "image": "/uploads/evento_imagen.jpg",
    "estado": "abierto",
    "EventoTipo": {
      "id": 1,
      "nombre": "Incidente de Seguridad",
      "descripcion": "Eventos relacionados con seguridad"
    }
  }
]
```

### 2. Obtener Eventos de una Tarea ⭐
**GET** `/getRelatedEventToTask/:id`

**Parámetros**: `id` = ID de la tarea

**Caso de Uso**: Mostrar eventos vinculados en vista de detalle.

### 3. Vincular Evento a Tarea ⭐
**POST** `/postRelatedEventToTask`

**Body**:
```json
{
  "taskId": 1,
  "eventoId": 5
}
```

**Caso de Uso**: Asociar incidentes/reportes de campo con tareas de seguimiento.

### 4. Desvincular Evento
**POST** `/deleteRelatedEventToTask`

**Body**:
```json
{
  "taskId": 1,
  "eventoId": 5
}
```

---

## 📊 UTILIDADES Y LISTADOS {#utilidades}

### 1. Obtener Usuarios de la Empresa ⭐
**GET** `/listausuarios/:id`

**Descripción**: Para selectores de usuarios en formularios.

**Respuesta**:
```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@empresa.com",
    "telefono": "+56912345678",
    "grado": "Ingeniero"
  }
]
```

**Filtrado Automático**:
- Solo usuarios de empresas compartidas
- Excluye usuarios en lista de "no ver"

### 2. Lista Simple de Tareas ⭐
**GET** `/listatasksusuario/:id`

**Descripción**: Para autocompletado y selectores.

**Respuesta**:
```json
[
  {
    "id": 1,
    "detalleTask": "Revisión de documentos"
  }
]
```

---

# 🔄 WEBSOCKET REAL-TIME {#websocket-real-time}

## Configuración de Conexión

**⚠️ CRÍTICO**: NUNCA conectar directamente al puerto 3002. Usar siempre el proxy.

### URLs de Conexión:
- **Desarrollo**: `ws://localhost/socket2`
- **Producción**: `wss://dominio.com/socket2`

### Configuración Recomendada:
```javascript
import { io } from 'socket.io-client';

const getSocketURL = () => {
  return import.meta.env.DEV
    ? 'ws://localhost/socket2'
    : `wss://${window.location.host}/socket2`;
};

const socket = io(getSocketURL(), {
  path: '/socket2',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 20000
});
```

## Eventos Disponibles

### Eventos que Frontend EMITE:
```javascript
// Actualización de tarea
socket.emit('taskUpdated', {
  taskId: 1,
  userId: currentUser.id,
  changes: { estado: 'en_desarrollo' },
  timestamp: new Date().toISOString()
});

// Eliminación de tarea
socket.emit('taskDeleted', {
  taskId: 1,
  userId: currentUser.id,
  timestamp: new Date().toISOString()
});

// Nuevo comentario
socket.emit('taskCommented', {
  taskId: 1,
  commentId: 5,
  userId: currentUser.id,
  content: "Nuevo comentario",
  timestamp: new Date().toISOString()
});
```

### Eventos que Frontend ESCUCHA:
```javascript
// Tarea actualizada por otro usuario
socket.on('taskUpdated', (data) => {
  if (data.userId === currentUser.id) return; // Evitar loop
  updateTaskInState(data.taskId, data.changes);
  showNotification(`Tarea ${data.taskId} actualizada`);
});

// Tarea eliminada
socket.on('taskDeleted', (data) => {
  if (data.userId === currentUser.id) return;
  removeTaskFromState(data.taskId);
  showNotification(`Tarea ${data.taskId} eliminada`);
});

// Nuevo comentario
socket.on('taskCommented', (data) => {
  if (data.userId === currentUser.id) return;
  addCommentToTask(data.taskId, data);
  showNotification(`Nuevo comentario en tarea ${data.taskId}`);
});
```

## Patrón de Integración Recomendado:
```javascript
const updateTask = async (taskId, updates) => {
  try {
    // 1. Actualizar en backend via API REST
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (response.ok) {
      // 2. Notificar a otros usuarios via WebSocket
      socket.emit('taskUpdated', {
        taskId,
        userId: currentUser.id,
        changes: updates,
        timestamp: new Date().toISOString()
      });

      // 3. Actualizar estado local
      updateLocalTaskState(await response.json());
    }
  } catch (error) {
    console.error('Error actualizando tarea:', error);
  }
};
```

---

# 🗂️ TIPOS DE DATOS Y MODELOS {#tipos-de-datos}

## Modelo Usuario (Autenticación)
```typescript
interface Usuario {
  id: number;
  rut?: string;
  grado?: string;
  nombre?: string;
  apellido?: string;
  email: string;
  telefono?: string;
  nivelAcceso?: string;
  rasgosDistintivos?: string;
  solicitarCambioPassword?: boolean;
  fechaCambioPassword?: Date;
  ultimoLogin?: Date;
  confirmado: boolean;
  empresas: Empresa[];
  dispositivos: any[];
}
```

## Modelo Task Principal
```typescript
interface Task {
  // Identificación
  id: number;
  clasificacion?: "U" | "P" | "N" | "C"; // U=Urgente, P=Prioritario, N=Normal, C=Común

  // Fechas
  fecha_hora_inicio?: Date;
  fecha_hora_termino?: Date;
  fecha_finalizacion?: Date; // ✅ Fecha real de finalización
  createdAt: Date;
  updatedAt: Date;

  // Contenido
  detalleTask?: string;
  tipo?: string;

  // Ubicación
  latitude?: number; // FLOAT(10,7)
  longitude?: number; // FLOAT(10,7)

  // Multimedia
  image?: string;
  video?: string;

  // Relaciones
  creadorId: number;

  // Estados
  estado?: "disponible" | "en_desarrollo" | "en_revision" | "archivado";
  categoria?: string;
  sidebar?: "left" | "right" | "center";

  // Configuración
  minutos?: number;
  proceso?: string;

  // Control de visualización
  vistoPor: number[]; // Array de User IDs
}
```

## TaskUsuario (Participantes)
```typescript
interface TaskUsuario {
  id: number;
  taskId: number;
  usuarioId: number;

  rol?: "superior" | "jefe tarea" | "subordinado" | "facilitador" | "asesor" | "informado";
  privilegio: boolean;

  clasificacion?: string;
  fecha_hora_inicio?: Date;
  fecha_hora_termino?: Date;
  detalleUsuario?: string;
  vista: boolean;
  derivado: number; // LEGACY
}
```

## TaskComentario (Sistema Anidado)
```typescript
interface TaskComentario {
  id: number;
  taskId: number;
  usuarioId: number;

  detalleTaskComentario?: string;
  clasificacion?: string;

  // Anidado
  parentId?: number; // null = principal
  nivel: number; // 0 = principal, 1+ = respuestas

  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  usuario: Usuario;
  reacciones: TaskComentarioReaccion[];
}
```

## Constantes Importantes
```typescript
// Estados de tarea
const TASK_ESTADOS = ["disponible", "en_desarrollo", "en_revision", "archivado"];

// Tipos de reacciones
const REACCIONES = ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "✅", "❌"];

// Clasificaciones de tarea
const CLASIFICACIONES = [
  { value: 'U', label: 'Urgente', priority: 1 },
  { value: 'P', label: 'Prioritario', priority: 2 },
  { value: 'N', label: 'Normal', priority: 3 },
  { value: 'C', label: 'Común', priority: 4 }
];

// Roles con jerarquía
const TASK_ROLES = [
  { value: 'superior', weight: 1 },
  { value: 'jefe tarea', weight: 2 },
  { value: 'subordinado', weight: 3 },
  { value: 'facilitador', weight: 4 },
  { value: 'asesor', weight: 5 },
  { value: 'informado', weight: 6 }
];
```

---

# ⚙️ LÓGICA DE NEGOCIO {#lógica-de-negocio}

## Sistema de Visualización (vistoPor)
```javascript
// Estado inicial
vistoPor = [creadorId]

// Al modificar tarea
vistoPor = [usuarioQueModificaId] // Se reinicia

// Al marcar como vista
vistoPor.push(userId) // Sin duplicados
```

**Endpoints que Modifican vistoPor**:
- `POST /` (crear tarea)
- `PUT /:id` (editar tarea)
- `PUT /marcar-vista/:id`
- `POST /comentario`
- `POST /tasksusuarios`
- `POST /withfiles`

## Sistema de Estados
```javascript
// Comportamiento especial estado 'archivado'
if (estado === 'archivado') {
  if (!fecha_finalizacion) {
    fecha_finalizacion = new Date();
  }
}

if (estado !== 'archivado') {
  fecha_finalizacion = null;
}
```

## Filtrado de Notificaciones
```javascript
// obtenerNotificacionesUsuario excluye:
1. task.vistoPor.includes(userId) // Ya vista
2. task.estado === "archivado" // Archivada
3. task.sidebar === "left" && task.fecha_hora_termino < now // Calendario vencido
```

## Sistema de Privilegios
```javascript
// Jerarquía:
Creador → TODO (CRUD + privilegios)
Privilegiado → Editar (NO eliminar)
Normal → Solo comentar/ver
```

## Validaciones de Tiempo
```javascript
// Edición comentarios: máximo 1 hora
const horas = (now - createdAt) / (1000 * 60 * 60);
if (horas > 1) return 403;
```

---

# 🚨 CÓDIGOS DE ERROR {#códigos-de-error}

| Código | Descripción | Casos Comunes |
|--------|-------------|---------------|
| **200** | OK | Operación exitosa |
| **201** | Created | Login exitoso, registro exitoso |
| **400** | Bad Request | Datos faltantes, IDs inválidos |
| **401** | Unauthorized | Token JWT inválido/ausente |
| **403** | Forbidden | Sin permisos, contraseña incorrecta, edición después de 1h |
| **404** | Not Found | Usuario/tarea/comentario no existe |
| **500** | Server Error | Error de BD, problemas de archivo |

## Manejo de Errores Frontend Recomendado:
```javascript
const handleApiError = (error, response) => {
  switch (response.status) {
    case 401:
      // Token expirado - redirigir a login
      localStorage.removeItem('token');
      router.push('/login');
      break;
    case 403:
      showError('No tienes permisos para esta acción');
      break;
    case 404:
      showError('Recurso no encontrado');
      break;
    default:
      showError('Error del servidor');
  }
};
```

---

## 🎯 CASOS DE USO VALIDADOS

### **Flujo de Login Completo**
1. `POST /api/usuarios/login` → Obtener token
2. Verificar `solicitarCambioPassword`
3. Si `true`: Forzar cambio → `POST /api/usuarios/cambiar-password`
4. Si `false`: Continuar → Dashboard

### **Dashboard Frontend**
1. `GET /api/tasks/tasksdelusuario/:id` → 📋 **Cargar lista** (datos básicos)
2. `GET /api/tasks/notificaciones/:id` → 🔔 **Badge notificaciones**
3. `PUT /api/tasks/marcar-vista/:id` → ✅ **Marcar como leído**

### **Vista Detalle de Tarea**
1. `GET /api/tasks/:id` → 🔍 **Cargar detalle completo** (todos los datos)
2. Usuario hace clic en tarea → Usar endpoint individual, NO lista

### **Gestión de Tarea Completa**
1. `GET /api/tasks/:id` → Detalle
2. `POST /api/tasks/` → Crear
3. `PUT /api/tasks/:id` → Actualizar
4. Estado archivado → Auto-asigna `fecha_finalizacion`

### **Sistema de Comentarios**
1. `POST /api/tasks/comentario` → Comentar
2. `POST /api/tasks/comentario/responder` → Responder (anidado)
3. `POST /api/tasks/comentario/reaccion` → Reaccionar
4. `PUT /api/tasks/comentario/:id` → Editar (1h límite)

### **Colaboración en Tiempo Real**
1. API REST → Cambio en BD
2. WebSocket → Notificar otros usuarios
3. Estado local → Actualizar UI

---

## 📝 NOTAS FINALES

### **✅ Características Verificadas**:
1. **Autenticación JWT** completamente funcional
2. **CRUD Tareas** con relaciones completas
3. **Sistema de comentarios** anidados con reacciones
4. **Privilegios y roles** jerárquicos
5. **Notificaciones** basadas en `vistoPor`
6. **WebSocket** para tiempo real
7. **Campo fecha_finalizacion** automático
8. **Validaciones** de tiempo y permisos

### **⚠️ Consideraciones Importantes**:
1. **Token JWT**: Incluir en todas las peticiones autenticadas
2. **WebSocket**: Usar siempre proxy reverso
3. **Privilegios**: Solo creador otorga privilegios
4. **Comentarios**: Edición limitada a 1 hora
5. **Estados**: "archivado" asigna fecha automáticamente
6. **Notificaciones**: Se basan en array `vistoPor`
7. **Eventos**: Módulo independiente - consultar doc específica

### **🎯 Estado de la Documentación**:
✅ **100% Verificada y Funcional**
✅ **Lista para desarrollo frontend**
✅ **Incluye todos los casos de uso**
✅ **Integración completa autenticación + tareas**

**Última Actualización**: 2025-01-13