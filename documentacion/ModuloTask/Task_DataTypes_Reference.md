# Task Data Types Reference

## Tipos de Datos Principales

### Task Model
```typescript
interface Task {
  // Identificación
  id: number;
  clasificacion?: string;
  
  // Fechas
  fecha_hora_inicio?: Date;
  fecha_hora_termino?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Contenido
  detalleTask?: string;
  tipo?: string;
  
  // Ubicación geográfica
  latitude?: number; // FLOAT(10,7)
  longitude?: number; // FLOAT(10,7)
  
  // Multimedia
  image?: string;
  video?: string;
  
  // Relaciones
  creadorId: number; // FK -> Usuario.id
  
  // Estados y categorización
  estado?: TaskEstado;
  categoria?: string;
  sidebar?: TaskSidebar;
  
  // Configuración
  minutos?: number;
  proceso?: string;
  
  // Control de visualización
  vistoPor: number[]; // Array de Usuario.id que han visto la tarea
}
```

### Task Estados
```typescript
type TaskEstado = 'disponible' | 'en_desarrollo' | 'en_revision' | 'archivado';
```

### Task Sidebar
```typescript
type TaskSidebar = 'left' | 'right' | 'center';
```

### TaskUsuario Model (Tabla de participantes)
```typescript
interface TaskUsuario {
  id: number;
  taskId: number; // FK -> Task.id
  usuarioId: number; // FK -> Usuario.id
  
  // Rol y permisos
  rol?: TaskRol;
  privilegio: boolean; // true = puede editar tarea completa (excepto eliminar)
  
  // Metadata del usuario en la tarea
  clasificacion?: string;
  fecha_hora_inicio?: Date;
  fecha_hora_termino?: Date;
  detalleUsuario?: string;
  vista: boolean;
  
  // Funcionalidad futura
  derivado: number; // LEGACY - Reservado para derivación de tareas
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Task Roles
```typescript
type TaskRol = 'superior' | 'jefe tarea' | 'subordinado' | 'facilitador' | 'asesor' | 'informado';

// Descripción de roles:
const TASK_ROLES = [
  { value: 'superior', weight: 1, description: "Jefe superior, quien dispone o tiene interés en la tarea" },
  { value: 'jefe tarea', weight: 2, description: "Responsable de que la tarea se cumpla" },
  { value: 'subordinado', weight: 3, description: "Cumplirá las subtareas del jefe de tarea a su requerimiento" },
  { value: 'facilitador', weight: 4, description: "Entregará información al jefe de tarea a su requerimiento" },
  { value: 'asesor', weight: 5, description: "Deberá asesorar al jefe de tarea a su requerimiento" },
  { value: 'informado', weight: 6, description: "No participa activamente, pero se da por informado para otros fines" }
];
```

### TaskComentario Model
```typescript
interface TaskComentario {
  id: number;
  taskId: number; // FK -> Task.id
  usuarioId: number; // FK -> Usuario.id
  
  // Contenido
  clasificacion?: string;
  detalleTaskComentario?: string;
  prioridad?: string;
  
  // Sistema de comentarios anidados
  parentId?: number; // FK -> TaskComentario.id (null = comentario principal)
  nivel: number; // 0 = comentario principal, 1+ = niveles de respuesta
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### TaskComentarioReaccion Model
```typescript
interface TaskComentarioReaccion {
  id: number;
  comentarioId: number; // FK -> TaskComentario.id
  usuarioId: number; // FK -> Usuario.id
  tipoReaccion: ReaccionType;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Tipos de Reacciones
```typescript
type ReaccionType = "👍" | "👎" | "❤️" | "😂" | "😮" | "😢" | "😡" | "✅" | "❌";

const AVAILABLE_REACTIONS = ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "✅", "❌"];
```

### TaskFile Model
```typescript
interface TaskFile {
  id: number;
  taskId: number; // FK -> Task.id
  nombre: string;
  url: string; // Ruta del archivo en servidor
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### TaskToTask Model (Relaciones padre-hija)
```typescript
interface TaskToTask {
  id: number;
  clasificacion?: string;
  taskPadreId: number; // FK -> Task.id
  taskHijaId: number; // FK -> Task.id
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### TaskEtapas Model (Instancias de proceso)
```typescript
interface TaskEtapas {
  id: number;
  taskId: number; // FK -> Task.id
  nombre: string;
  cumplida: boolean;
  observaciones?: string;
  n_orden?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### TaskEtapasAtributos Model
```typescript
interface TaskEtapasAtributos {
  id: number;
  etapaId: number; // FK -> TaskEtapas.id
  nombre: string;
  value?: string;
  cumplida: boolean;
  observaciones?: string;
  n_orden?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

## Modelos Relacionados

### Usuario Model (Scope: eliminarPassword)
```typescript
interface UsuarioSinPassword {
  id: number;
  rut?: string;
  grado?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  nivelAcceso?: number;
  isActive?: boolean;
  ultimoLogin?: Date;
  solicitarCambioPassword?: boolean;
  fechaCambioPassword?: Date;
  rasgosDistintivos?: string;
  
  // Excluidos: password, token, confirmado, createdAt, updatedAt
}
```

### Empresa Model
```typescript
interface Empresa {
  id: number;
  nombre: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### UsuarioConfiguracion Model (Tabla intermedia Usuario-Empresa)
```typescript
interface UsuarioConfiguracion {
  id: number;
  usuarioId: number; // FK -> Usuario.id
  empresaId: number; // FK -> Empresa.id
  tema?: string;
  idioma?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Evento Model
```typescript
interface Evento {
  id: number;
  clasificacion?: string;
  fecha_hora_inicio?: Date;
  fecha_hora_termino?: Date;
  observaciones?: string;
  
  // Geolocalización
  latitude?: number; // FLOAT(10,7)
  longitude?: number; // FLOAT(10,7)
  altitude?: number; // FLOAT(10,7)
  
  // Ubicación contextual
  ssid?: string;
  sector?: string;
  
  // Multimedia
  image?: string;
  video?: string;
  audio?: string;
  
  // Tipo y estado
  tipo?: string; // Tipo como string directo
  tipoId?: number; // DEPRECATED: Usar campo "tipo"
  estado?: string;
  
  // Relación empresa
  empresaId?: number; // FK -> Empresa.id
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### TaskToEvent Model (Relación Task-Evento)
```typescript
interface TaskToEvent {
  id: number;
  clasificacion?: string;
  taskId: number; // FK -> Task.id
  eventoId: number; // FK -> Evento.id
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

## Asociaciones Sequelize

### Task Associations
```javascript
// Creador
Task.belongsTo(Usuario, { foreignKey: "creadorId", as: "creador" });

// Participantes
Task.hasMany(TaskUsuario, { foreignKey: "taskId", as: "tasksusuarios" });
TaskUsuario.belongsTo(Usuario, { foreignKey: "usuarioId" });

// Comentarios
Task.hasMany(TaskComentario, { foreignKey: "taskId", as: "taskscomentarios" });
TaskComentario.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

// Reacciones a comentarios
TaskComentario.hasMany(TaskComentarioReaccion, { as: 'reacciones', foreignKey: 'comentarioId' });
TaskComentarioReaccion.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Archivos
Task.hasMany(TaskFile, { as: "files", foreignKey: "taskId" });

// Relaciones padre-hija
Task.belongsToMany(Task, { as: 'Hijas', through: TaskToTask, foreignKey: 'taskPadreId' });
Task.belongsToMany(Task, { as: 'Padres', through: TaskToTask, foreignKey: 'taskHijaId' });

// Etapas de proceso
Task.hasMany(TaskEtapas, { foreignKey: "taskId", as: "tasksetapas" });
TaskEtapas.hasMany(TaskEtapasAtributos, { foreignKey: "etapaId", as: "atributos" });

// Eventos
Task.belongsToMany(Evento, { as: 'EventsInTask', through: TaskToEvent, foreignKey: 'taskId' });

// Comentarios anidados (self-reference)
TaskComentario.hasMany(TaskComentario, { as: 'respuestas', foreignKey: 'parentId' });
TaskComentario.belongsTo(TaskComentario, { as: 'comentarioPadre', foreignKey: 'parentId' });
```

### Usuario-Empresa Association
```javascript
Usuario.belongsToMany(Empresa, {
  through: UsuarioConfiguracion,
  foreignKey: "usuarioId",
  as: 'empresas'
});

Empresa.belongsToMany(Usuario, {
  through: UsuarioConfiguracion,
  foreignKey: "empresaId", 
  as: 'usuarios'
});
```

## Tipos de Respuesta Comunes

### Task con todas las relaciones
```typescript
interface TaskCompleta extends Task {
  creador: UsuarioSinPassword;
  tasksusuarios: (TaskUsuario & { Usuario: UsuarioSinPassword })[];
  taskscomentarios: (TaskComentario & { 
    usuario: UsuarioSinPassword;
    reacciones: (TaskComentarioReaccion & { Usuario: UsuarioSinPassword })[];
  })[];
  tasksetapas: (TaskEtapas & { atributos: TaskEtapasAtributos[] })[];
  files: TaskFile[];
  Hijas: Task[];
  Padres: Task[];
}
```

### Notificación
```typescript
interface TaskNotificacion {
  id: number;
  detalleTask: string;
  categoria: string;
  sidebar: string;
  updatedAt: Date;
  creador: UsuarioSinPassword;
  ultimoComentario?: {
    contenido: string;
    usuario: UsuarioSinPassword;
    createdAt: Date;
  };
  tipoNotificacion: 'comment' | 'update';
}
```
