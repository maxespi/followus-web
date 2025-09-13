# API Documentación - Módulo de Tareas

## Base URL
```
/api/tasks
```

## Autenticación
Todas las rutas requieren autenticación mediante middleware `checkAuth`. El token debe enviarse en los headers de la petición.

---

## Documentación Complementaria
- **Tipos de Datos**: Ver `Task_DataTypes_Reference.md` para estructuras completas de modelos
- **Lógica de Negocio**: Ver `TaskController_Business_Logic.md` para reglas y validaciones

---

## Endpoints

### 1. Obtener Tareas del Usuario
**GET** `/tasksdelusuario/:id`

**Descripción:** Obtiene todas las tareas donde el usuario es creador o participante.

**Parámetros:**
- `id` (path): ID del usuario (integer)

**Respuesta:**
```json
[
  {
    "id": 1,
    "detalleTask": "string",
    "categoria": "string",
    "estado": "disponible|en_desarrollo|en_revision|archivado",
    "createdAt": "datetime",
    "sidebar": "string",
    "clasificacion": "string",
    "vistoPor": [1, 2, 3],
    "fecha_hora_termino": "datetime",
    "fecha_hora_inicio": "datetime",
    "creador": {
      "id": 1,
      "nombre": "string",
      "apellido": "string"
    },
    "tasksusuarios": [
      {
        "usuarioId": 1,
        "privilegio": false,
        "Usuario": {
          "id": 1,
          "nombre": "string",
          "apellido": "string"
        }
      }
    ]
  }
]
```

### 2. Obtener Notificaciones del Usuario
**GET** `/notificaciones/:id`

**Descripción:** Obtiene las tareas que requieren atención del usuario (no vistas).

**Parámetros:**
- `id` (path): ID del usuario (integer)

**Respuesta:**
```json
[
  {
    "id": 1,
    "detalleTask": "string",
    "categoria": "string",
    "sidebar": "string",
    "updatedAt": "datetime",
    "creador": {
      "id": 1,
      "nombre": "string",
      "apellido": "string"
    },
    "ultimoComentario": {
      "contenido": "string",
      "usuario": {
        "id": 1,
        "nombre": "string",
        "apellido": "string"
      },
      "createdAt": "datetime"
    },
    "tipoNotificacion": "comment|update"
  }
]
```

### 3. Obtener Tarea Individual
**GET** `/:id`

**Descripción:** Obtiene una tarea específica con todos sus detalles.

**Parámetros:**
- `id` (path): ID de la tarea (integer)

**Respuesta:**
```json
{
  "id": 1,
  "clasificacion": "string",
  "fecha_hora_inicio": "datetime",
  "fecha_hora_termino": "datetime",
  "detalleTask": "string",
  "tipo": "string",
  "latitude": 10.1234567,
  "longitude": -70.1234567,
  "image": "string",
  "video": "string",
  "creadorId": 1,
  "estado": "disponible|en_desarrollo|en_revision|archivado",
  "categoria": "string",
  "minutos": 30,
  "sidebar": "string",
  "proceso": "string",
  "vistoPor": [1, 2],
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "creador": {
    "id": 1,
    "nombre": "string",
    "apellido": "string"
  },
  "tasksusuarios": [
    {
      "id": 1,
      "usuarioId": 1,
      "privilegio": false,
      "rol": "string",
      "Usuario": {
        "id": 1,
        "nombre": "string",
        "apellido": "string"
      }
    }
  ],
  "taskscomentarios": [
    {
      "id": 1,
      "detalleTaskComentario": "string",
      "parentId": null,
      "nivel": 0,
      "createdAt": "datetime",
      "usuario": {
        "id": 1,
        "nombre": "string",
        "apellido": "string"
      },
      "reacciones": [
        {
          "id": 1,
          "tipoReaccion": "👍",
          "Usuario": {
            "id": 1,
            "nombre": "string",
            "apellido": "string"
          }
        }
      ]
    }
  ],
  "tasksetapas": [
    {
      "id": 1,
      "nombre": "string",
      "cumplida": false,
      "observaciones": "string",
      "n_orden": 1,
      "atributos": [
        {
          "id": 1,
          "nombre": "string",
          "value": "string",
          "cumplida": false,
          "observaciones": "string",
          "n_orden": 1
        }
      ]
    }
  ],
  "files": [
    {
      "id": 1,
      "nombre": "string",
      "url": "string"
    }
  ],
  "Hijas": [
    {
      "id": 2,
      "detalleTask": "string"
    }
  ],
  "Padres": [
    {
      "id": 3,
      "detalleTask": "string"
    }
  ]
}
```

### 4. Crear Nueva Tarea
**POST** `/`

**Body:**
```json
{
  "clasificacion": "string",
  "fecha_hora_inicio": "datetime",
  "fecha_hora_termino": "datetime",
  "detalleTask": "string",
  "tipo": "string",
  "latitude": 10.1234567,
  "longitude": -70.1234567,
  "image": "string",
  "video": "string",
  "creadorId": 1,
  "estado": "disponible|en_desarrollo|en_revision|archivado",
  "categoria": "string",
  "minutos": 30,
  "sidebar": "string",
  "proceso": "string"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Tarea ingresado",
  "data": {
    "id": 1,
    "clasificacion": "string",
    "detalleTask": "string",
    "vistoPor": [1],
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

### 5. Actualizar Tarea
**PUT** `/:id`

**Parámetros:**
- `id` (path): ID de la tarea (integer)

**Body:** (todos los campos opcionales)
```json
{
  "clasificacion": "string",
  "fecha_hora_inicio": "datetime",
  "fecha_hora_termino": "datetime",
  "detalleTask": "string",
  "tipo": "string",
  "latitude": 10.1234567,
  "longitude": -70.1234567,
  "estado": "disponible|en_desarrollo|en_revision|archivado",
  "categoria": "string",
  "minutos": 30,
  "sidebar": "string",
  "proceso": "string"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Tarea actualizada",
  "data": {
    "id": 1,
    "detalleTask": "string actualizado",
    "vistoPor": [1],
    "updatedAt": "datetime"
  }
}
```

### 6. Eliminar Tarea
**DELETE** `/:id`

**Parámetros:**
- `id` (path): ID de la tarea (integer)

**Respuesta:**
```json
"Tarea eliminado"
```

## Gestión de Comentarios

### 7. Crear Comentario
**POST** `/comentario`

**Body:**
```json
{
  "taskId": 1,
  "detalleTaskComentario": "string",
  "clasificacion": "string"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Comentario ingresado",
  "data": {
    "id": 1,
    "detalleTaskComentario": "string",
    "taskId": 1,
    "usuarioId": 1,
    "createdAt": "datetime",
    "usuario": {
      "id": 1,
      "nombre": "string"
    }
  }
}
```

### 8. Responder Comentario
**POST** `/comentario/responder`

**Body:**
```json
{
  "taskId": 1,
  "parentId": 1,
  "detalleTaskComentario": "string",
  "clasificacion": "respuesta"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Respuesta creada",
  "data": {
    "id": 2,
    "parentId": 1,
    "nivel": 1,
    "detalleTaskComentario": "string",
    "usuario": {
      "id": 1,
      "nombre": "string",
      "apellido": "string"
    },
    "reacciones": []
  }
}
```

### 9. Editar Comentario
**PUT** `/comentario/:id`

**Parámetros:**
- `id` (path): ID del comentario (integer)

**Body:**
```json
{
  "detalleTaskComentario": "string editado"
}
```

**Restricciones:**
- Solo el autor puede editar
- Máximo 1 hora después de creado

**Respuesta:**
```json
{
  "success": true,
  "message": "Comentario actualizado",
  "data": {
    "id": 1,
    "detalleTaskComentario": "string editado",
    "updatedAt": "datetime"
  }
}
```

### 10. Eliminar Comentario
**DELETE** `/comentario/:id`

**Parámetros:**
- `id` (path): ID del comentario (integer)

**Respuesta:**
```json
"Comentario eliminado"
```

### 11. Reaccionar a Comentario
**POST** `/comentario/reaccion`

**Body:**
```json
{
  "comentarioId": 1,
  "tipoReaccion": "👍"
}
```

**Tipos de reacción:** Ver constante `AVAILABLE_REACTIONS` en Task_DataTypes_Reference.md

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "detalleTaskComentario": "string",
    "usuario": {
      "id": 1,
      "nombre": "string",
      "apellido": "string"
    },
    "reacciones": [
      {
        "id": 1,
        "tipoReaccion": "👍",
        "Usuario": {
          "id": 1,
          "nombre": "string",
          "apellido": "string"
        }
      }
    ]
  }
}
```

## Gestión de Usuarios en Tareas

### 12. Asignar/Actualizar Usuario a Tarea
**POST** `/tasksusuarios`

**Body:**
```json
{
  "taskId": 1,
  "usuarioId": 2,
  "rol": "superior|jefe tarea|subordinado|facilitador|asesor|informado",
  "clasificacion": "string",
  "fecha_hora_inicio": "datetime",
  "fecha_hora_termino": "datetime",
  "detalleUsuario": "string",
  "derivado": 0,
  "vista": false
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Responsable de tarea ingresado",
  "data": {
    "id": 1,
    "taskId": 1,
    "usuarioId": 2,
    "rol": "string",
    "privilegio": false,
    "Usuario": {
      "id": 2,
      "nombre": "string",
      "apellido": "string"
    }
  }
}
```

### 13. Actualizar Privilegios de Usuario
**PUT** `/privilegio`

**Body:**
```json
{
  "taskUsuarioId": 1,
  "privilegio": true
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Privilegios otorgados",
  "data": {
    "id": 1,
    "privilegio": true,
    "Usuario": {
      "id": 2,
      "nombre": "string",
      "apellido": "string"
    }
  }
}
```

### 14. Eliminar Usuario de Tarea
**DELETE** `/tasksusuarios/:id`

**Parámetros:**
- `id` (path): ID de la relación TaskUsuario (integer)

**Respuesta:**
```json
"Responsable eliminado"
```

## Gestión de Archivos

### 15. Subir Archivos a Tarea
**POST** `/withfiles`

**Content-Type:** `multipart/form-data`

**Body:**
- `files`: Array de archivos (máximo 10)
- `taskId`: ID de la tarea (integer)
- `names`: Array de nombres personalizados (opcional)

**Respuesta:**
```json
{
  "success": true,
  "message": "Archivos de tarea ingresados",
  "data": {
    "id": 1,
    "vistoPor": [1]
  }
}
```

### 16. Actualizar Nombre de Archivo
**PUT** `/updateTaskFileName/:id`

**Parámetros:**
- `id` (path): ID del archivo (integer)

**Body:**
```json
{
  "newName": "nuevo_nombre.pdf"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Nombre del archivo actualizado",
  "data": {
    "id": 1,
    "nombre": "nuevo_nombre.pdf",
    "url": "/uploads/file.pdf"
  }
}
```

### 17. Eliminar Archivo
**DELETE** `/withfiles/:id`

**Parámetros:**
- `id` (path): ID del archivo (integer)

**Respuesta:**
```json
"Archivo eliminado"
```

## Gestión de Visualización

### 18. Marcar Tarea como Vista
**PUT** `/marcar-vista/:id`

**Parámetros:**
- `id` (path): ID de la tarea (integer)

**Respuesta:**
```json
{
  "id": 1,
  "vistoPor": [1, 2],
  "updatedAt": "datetime"
}
```

### 19. Marcar Tarea como No Vista
**PUT** `/marcar-no-vista/:id`

**Parámetros:**
- `id` (path): ID de la tarea (integer)

**Body:** (opcional)
```json
{
  "excludeUserId": 1
}
```

**Respuesta:**
```json
{
  "msg": "Tarea marcada como no vista para todos los participantes.",
  "vistoPor": []
}
```

## Relaciones entre Tareas

### 20. Crear Relación Padre-Hija
**POST** `/relation`

**Body:**
```json
{
  "taskPadreId": 1,
  "taskHijaId": 2
}
```

**Respuesta:**
```json
{
  "message": "Task relation created successfully",
  "taskHija": {
    "id": 2,
    "detalleTask": "string"
  },
  "taskPadre": {
    "id": 1,
    "detalleTask": "string"
  }
}
```

### 21. Obtener Tareas Hijas
**GET** `/relation/hijas/:id`

**Parámetros:**
- `id` (path): ID de la tarea padre (integer)

**Respuesta:**
```json
[
  {
    "id": 2,
    "detalleTask": "string",
    "estado": "string"
  }
]
```

### 22. Obtener Tareas Padres
**GET** `/relation/padres/:id`

**Parámetros:**
- `id` (path): ID de la tarea hija (integer)

**Respuesta:**
```json
[
  {
    "id": 1,
    "detalleTask": "string",
    "estado": "string"
  }
]
```

### 23. Eliminar Relación
**DELETE** `/relation/:id`

**Parámetros:**
- `id` (path): ID de la relación (integer)

**Respuesta:**
```json
{
  "message": "Task relation deleted successfully",
  "taskHija": {
    "id": 2,
    "detalleTask": "string"
  },
  "taskPadre": {
    "id": 1,
    "detalleTask": "string"
  }
}
```

## Utilidades

### 24. Obtener Usuarios de Empresa
**GET** `/listausuarios/:id`

**Parámetros:**
- `id` (path): ID del usuario (integer)

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "string",
    "apellido": "string"
  }
]
```

### 25. Obtener Lista de Tareas para Selección
**GET** `/listatasksusuario/:id`

**Parámetros:**
- `id` (path): ID del usuario (integer)

**Respuesta:**
```json
[
  {
    "id": 1,
    "detalleTask": "string"
  }
]
```

## Códigos de Error Comunes

- **400**: Bad Request - Datos inválidos
- **401**: Unauthorized - Token inválido o ausente
- **403**: Forbidden - Sin permisos para la acción
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

## Notas Importantes

1. **Autenticación**: Todas las rutas requieren token JWT válido
2. **Timestamps**: Todas las fechas están en formato ISO 8601
3. **Archivos**: Máximo 10 archivos por tarea, límite de 10MB por petición
4. **Coordenadas**: Latitude y longitude con precisión de 7 decimales
5. **Comentarios**: Solo editables por el autor dentro de 1 hora
6. **Privilegios**: Solo el creador puede otorgar privilegios. Usuario privilegiado puede editar todo excepto eliminar
7. **vistoPor**: Se reinicia con cada modificación, contiene IDs de usuarios que han visto la tarea
8. **derivado**: Campo legacy reservado para funcionalidad futura de derivación
9. **Tipos detallados**: Ver Task_DataTypes_Reference.md para especificaciones completas
10. **Lógica de negocio**: Ver TaskController_Business_Logic.md para reglas y validaciones
