# TaskController Business Logic Reference

## Sistema de Visualización (vistoPor)

### Lógica del campo vistoPor
- **Propósito**: Controlar qué usuarios han visto una tarea para el sistema de notificaciones
- **Tipo**: Array de números (User IDs)
- **Comportamiento**:
    - Al crear tarea: `vistoPor = [creadorId]`
    - Al modificar tarea: `vistoPor = [usuarioQueModificaId]` (se reinicia)
    - Al marcar como vista: Se agrega el userId al array sin duplicados

### Endpoints que modifican vistoPor:
- `POST /` (nuevoTask) → `[creadorId]`
- `PUT /:id` (editarTask) → `[req.usuario.id]`
- `PUT /marcar-vista/:id` → Agregar userId al array
- `PUT /marcar-no-vista/:id` → Resetear array (opcional excluir un usuario)
- `POST /comentario` → `[req.usuario.id]`
- `POST /tasksusuarios` → `[req.usuario.id]`
- `POST /withfiles` → `[req.usuario.id]`

## Sistema de Privilegios

### Roles en TaskUsuario
Cada usuario invitado tiene un rol con jerarquía (weight):

1. **Superior** (weight: 1): Jefe superior, dispone o tiene interés en la tarea
2. **Jefe Tarea** (weight: 2): Responsable de que la tarea se cumpla
3. **Subordinado** (weight: 3): Cumple subtareas del jefe a su requerimiento
4. **Facilitador** (weight: 4): Entrega información al jefe a su requerimiento
5. **Asesor** (weight: 5): Asesora al jefe a su requerimiento
6. **Informado** (weight: 6): No participa activamente, solo se informa

### Sistema de Privilegios
- **Creador de tarea**: Puede hacer todo (crear, editar, eliminar, otorgar privilegios)
- **Usuario con privilegio=true**: Puede editar tarea completa EXCEPTO eliminar
- **Usuario sin privilegio**: Solo puede comentar y ver (según permisos de empresa)

### Validaciones de privilegios:
```javascript
// Solo creador puede otorgar privilegios
if (task.creadorId !== req.usuario.id) {
  return 403: "Solo el creador puede modificar privilegios"
}

// Solo creador puede eliminar tarea
// Usuario privilegiado puede editar pero NO eliminar
```

## Sistema de Notificaciones

### Lógica de filtrado (obtenerNotificacionesUsuario):

#### Criterios de exclusión:
1. **Ya vista**: `task.vistoPor.includes(parseInt(userId))`
2. **Estado archivado**: `task.estado === "archivado"`
3. **Tareas vencidas de calendario**:
    - Solo si `task.sidebar === "left"`
    - Y `task.fecha_hora_termino < ahora`

#### Tipos de notificación:
- **'comment'**: Tarea tiene último comentario
- **'update'**: Tarea fue modificada sin comentarios nuevos

#### Ordenamiento:
Por fecha más reciente (último comentario o updatedAt)

## Validaciones de Negocio

### Comentarios
- **Edición permitida**: Solo 1 hora después de creación
- **Autor requerido**: Solo el autor puede editar sus comentarios
- **Comentarios anidados**: `nivel = parentComment.nivel + 1`

### Archivos
- **Límite**: Máximo 10 archivos por tarea
- **Eliminación**: Borra registro DB + archivo físico del servidor
- **Encoding**: Manejo de caracteres especiales con iconv-lite

### Relaciones Padre-Hija
- **Validación circular**: Sistema debe prevenir relaciones circulares
- **Cascada**: Al eliminar tarea, se eliminan todas las relaciones

## Estados de Tarea

### Estados válidos:
- **'disponible'**: Tarea creada y lista para trabajo
- **'en_desarrollo'**: Tarea en progreso
- **'en_revision'**: Tarea completada, pendiente revisión
- **'archivado'**: Tarea finalizada/archivada

### Comportamientos por estado:
- **'archivado'**: Excluida de notificaciones y listados principales
- **Otros estados**: Incluidos en todas las operaciones normales

## Sistema de Empresas

### Visibilidad de usuarios:
- `obtenerUsuariosDeEmpresa`: Solo usuarios de mismas empresas que el solicitante
- Filtrado por tabla `UsuarioConfiguracion` (relación Usuario-Empresa)
- Exclusión adicional por tabla `NoViewUser`

### Lógica de filtrado:
```javascript
// 1. Obtener empresas del usuario solicitante
const empresaIds = usuarioConfiguraciones.map(config => config.empresaId);

// 2. Filtrar usuarios que pertenecen a mismas empresas
const usuarios = todosLosUsuarios.filter(usuario =>
  usuario.empresas.some(empresa => empresaIds.includes(empresa.id)) &&
  !noViewUserIds.includes(usuario.id)
);
```

## Procesos y Etapas

### TaskEtapas (Instancias de proceso):
- **Vinculación**: Una tarea puede tener múltiples etapas secuenciales
- **Orden**: Campo `n_orden` define secuencia
- **Estado**: Campo `cumplida` marca completitud
- **Atributos**: Cada etapa puede tener múltiples atributos configurables

### TaskEtapasAtributos:
- **Tipos**: Campos configurables por etapa
- **Validación**: Campo `cumplida` para marcar completitud
- **Orden**: Campo `n_orden` para secuencia dentro de etapa

## Casos de Error Específicos

### 400 Bad Request:
- Datos faltantes en body (comentarioId, tipoReaccion)
- IDs inválidos (taskId no numérico)
- Fechas inválidas ('Invalid date')

### 403 Forbidden:
- Editar comentario después de 1 hora
- Usuario sin permisos intenta editar privilegios
- Usuario no privilegiado intenta editar tarea

### 404 Not Found:
- Tarea inexistente
- Comentario inexistente
- Archivo inexistente
- Usuario no encontrado

### 500 Internal Server Error:
- Errores de base de datos
- Problemas de archivo físico
- Fallos en asociaciones Sequelize

## Funcionalidades Legacy/Futuras

### Campo 'derivado':
- **Estado actual**: Legacy, no en uso
- **Propósito futuro**: Sistema de derivación de tareas específicas a usuarios
- **Implementación**: Pendiente desarrollo futuro
- **Valor actual**: Siempre 0

### Sistema de Tags:
- **Asociación**: Task.belongsToMany(Tag) via tabla 'tasktags'
- **Estado**: Implementado en modelo pero no en controller actual
- **Uso**: Futuro sistema de etiquetado/categorización

## Consideraciones de Rendimiento

### Optimizaciones implementadas:
1. **obtenerTask**: Separación de consultas para evitar producto cartesiano
2. **Scope Usuario**: 'eliminarPassword' excluye campos sensibles
3. **Indices únicos**: TaskComentarioReaccion previene reacciones duplicadas

### Consultas pesadas identificadas:
- `obtenerTasksUsuario`: Múltiples JOINs con includes anidados
- `obtenerNotificacionesUsuario`: Lógica compleja de filtrado
- Tareas con muchos comentarios y reacciones

## Reglas de Consistencia de Datos

### Al crear tarea:
1. creadorId debe existir en tabla usuarios
2. vistoPor se inicializa con [creadorId]
3. Timestamps se generan automáticamente

### Al eliminar tarea:
1. Cascada elimina: TaskUsuario, TaskComentario, TaskFile, TaskEtapas
2. Archivos físicos se eliminan del servidor
3. Relaciones padre-hija se eliminan de TaskToTask

### Al modificar participantes:
1. Solo creador puede modificar privilegios
2. vistoPor se reinicia con usuario que modifica
3. Validación de usuario existe antes de asignar
