# Integración Backend Tasks → Frontend Tickets

## 🎯 **Objetivo**
Migrar el sistema de tickets del frontend para consumir completamente la API de Tasks del backend, manteniendo la UX actual y agregando funcionalidades mínimas necesarias.

---

## 📋 **Tareas Pendientes para el Backend**

### 🔧 **Cambios Mínimos Necesarios (No Críticos)**

#### 1. **Mapeo de Estados Tasks → Tickets**
- **Backend actual**: `disponible | en_desarrollo | en_revision | archivado`
- **Frontend tickets**: `open | in_progress | pending | resolved | closed`

**Recomendación**: Agregar endpoint o lógica de mapeo:
```javascript
// Función sugerida para agregar al backend
const mapTaskStateToTicketStatus = (taskState) => {
  const mapping = {
    'disponible': 'open',
    'en_desarrollo': 'in_progress',
    'en_revision': 'pending',
    'archivado': 'closed'
  }
  return mapping[taskState] || 'open'
}
```

#### 2. **Campos Adicionales para Tickets (Opcionales)**
Campos que mejorarían la experiencia pero no son críticos:

```sql
-- Campos sugeridos para agregar a Tasks table (OPCIONAL)
ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'medium'; -- low, medium, high, urgent
ALTER TABLE tasks ADD COLUMN channel VARCHAR(20) DEFAULT 'web';     -- web, email, chat, phone
ALTER TABLE tasks ADD COLUMN customer_id INT;                       -- ID del cliente (podría ser usuarioId)
ALTER TABLE tasks ADD COLUMN agent_id INT;                          -- ID del agente asignado
ALTER TABLE tasks ADD COLUMN resolution TEXT;                       -- Resolución final del ticket
ALTER TABLE tasks ADD COLUMN satisfaction_rating INT;               -- Calificación 1-5
```

#### 3. **Endpoint de Estadísticas Dashboard**
Crear endpoint específico para métricas del dashboard:

```javascript
// GET /api/tasks/dashboard-stats/:userId
{
  "totalTasks": 150,
  "openTasks": 45,
  "inProgressTasks": 30,
  "resolvedToday": 12,
  "averageResponseTime": 2.5, // horas
  "tasksByCategory": {
    "soporte": 25,
    "bugs": 15,
    "feature": 5
  },
  "tasksByPriority": {
    "urgent": 3,
    "high": 12,
    "medium": 25,
    "low": 5
  }
}
```

### 📊 **Funcionalidades Deseadas (Futuras)**

#### 1. **SLA Management**
```sql
ALTER TABLE tasks ADD COLUMN sla_due_at DATETIME;
ALTER TABLE tasks ADD COLUMN first_response_at DATETIME;
ALTER TABLE tasks ADD COLUMN resolution_due_at DATETIME;
```

#### 2. **Ticket Templates**
```sql
CREATE TABLE task_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  content TEXT,
  category VARCHAR(100),
  created_at DATETIME,
  updated_at DATETIME
);
```

#### 3. **Knowledge Base Integration**
```sql
ALTER TABLE tasks ADD COLUMN related_kb_articles JSON;
```

---

## 🔄 **Mapeo de Datos Backend → Frontend**

### **Task → Ticket Mapping**

```typescript
interface TaskToTicketMapping {
  // Mapeo directo
  id: task.id,
  title: task.detalleTask,
  description: task.detalleTask,
  status: mapTaskStateToTicketStatus(task.estado),
  category: task.categoria,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,

  // Mapeo de relaciones
  creator: {
    id: task.creador.id,
    name: `${task.creador.nombre} ${task.creador.apellido}`,
    email: task.creador.email || 'No disponible'
  },

  // Mapeo de usuarios asignados
  assignedTo: task.tasksusuarios?.find(tu => tu.rol === 'jefe tarea')?.Usuario || null,
  participants: task.tasksusuarios?.map(tu => ({
    id: tu.Usuario.id,
    name: `${tu.Usuario.nombre} ${tu.Usuario.apellido}`,
    role: tu.rol,
    hasPrivileges: tu.privilegio
  })) || [],

  // Mapeo de comentarios → mensajes
  messages: task.taskscomentarios?.map(comment => ({
    id: comment.id,
    content: comment.detalleTaskComentario,
    author: {
      id: comment.usuario.id,
      name: `${comment.usuario.nombre} ${comment.usuario.apellido}`
    },
    createdAt: comment.createdAt,
    isInternal: comment.clasificacion === 'interno',
    reactions: comment.reacciones || []
  })) || [],

  // Campos con valores por defecto para compatibilidad
  priority: task.priority || 'medium',
  channel: task.channel || 'web',
  tags: task.categoria ? [task.categoria] : [],
  attachments: task.files || [],

  // Campos específicos del backend
  coordinates: {
    latitude: task.latitude,
    longitude: task.longitude
  },
  duration: task.minutos,
  process: task.proceso,
  sidebar: task.sidebar,
  viewedBy: task.vistoPor || [],

  // Relaciones jerárquicas
  parentTasks: task.Padres || [],
  childTasks: task.Hijas || [],

  // Etapas como checklist
  checklist: task.tasksetapas?.map(etapa => ({
    id: etapa.id,
    title: etapa.nombre,
    completed: etapa.cumplida,
    notes: etapa.observaciones,
    order: etapa.n_orden,
    attributes: etapa.atributos || []
  })) || []
}
```

---

## 🚀 **Plan de Migración Frontend**

### **Fase 1: Servicios API** ✅
- [x] Crear servicio de tareas (`lib/tasks.service.ts`)
- [x] Implementar mapeo de datos
- [x] Manejar errores y campos faltantes

### **Fase 2: Dashboard Principal** 🔄
- [ ] Migrar métricas principales
- [ ] Actualizar gráficos con datos reales
- [ ] Implementar notificaciones desde backend

### **Fase 3: Gestión de Tickets** 🔄
- [ ] Lista de tickets con filtros
- [ ] Detalle de ticket individual
- [ ] Crear/editar tickets
- [ ] Sistema de comentarios

### **Fase 4: Funcionalidades Avanzadas** ⏳
- [ ] Asignación de usuarios
- [ ] Gestión de archivos
- [ ] Relaciones padre-hija
- [ ] Estados avanzados

---

## ⚡ **Estrategia de Implementación**

### **1. Compatibilidad Total**
- Frontend funciona con campos faltantes
- Valores por defecto para datos no disponibles
- Degradación elegante de funcionalidades

### **2. Migración Gradual**
```typescript
// Ejemplo de implementación híbrida
const useTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTickets = async () => {
      try {
        // Intentar cargar desde backend real
        const tasks = await tasksService.getUserTasks(userId)
        const mappedTickets = tasks.map(mapTaskToTicket)
        setTickets(mappedTickets)
      } catch (error) {
        console.warn('Backend no disponible, usando datos demo')
        setTickets(DEMO_TICKETS) // Fallback a datos demo
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [userId])

  return { tickets, loading }
}
```

### **3. Logging y Debug**
```typescript
// Helper para debug
const logDataMapping = (originalTask: any, mappedTicket: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('Task → Ticket Mapping')
    console.log('Original Task:', originalTask)
    console.log('Mapped Ticket:', mappedTicket)
    console.log('Missing Fields:', findMissingFields(mappedTicket))
    console.groupEnd()
  }
}
```

---

## 🛡️ **Manejo de Errores**

### **Campos Faltantes**
```typescript
const safeFieldAccess = (obj: any, path: string, defaultValue: any = null) => {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue
}

// Uso
const ticketTitle = safeFieldAccess(task, 'detalleTask', 'Sin título')
const creatorName = safeFieldAccess(task, 'creador.nombre', 'Usuario desconocido')
```

### **Estados No Reconocidos**
```typescript
const mapTaskState = (estado: string) => {
  const stateMap = {
    'disponible': 'open',
    'en_desarrollo': 'in_progress',
    'en_revision': 'pending',
    'archivado': 'closed'
  }

  const mappedState = stateMap[estado]
  if (!mappedState) {
    console.warn(`Estado no reconocido: ${estado}, usando 'open' por defecto`)
    return 'open'
  }
  return mappedState
}
```

---

## 📝 **Resumen de Impacto**

### **Backend (Cambios Mínimos)**
- ✅ **API actual funciona perfectamente**
- 🟡 **Campos adicionales opcionales** para mejorar experiencia
- 🔵 **Endpoint de estadísticas** recomendado para dashboard

### **Frontend (Cambios Mayores)**
- 🔄 **Migración completa** de datos estáticos a API real
- ✅ **Mantiene UX actual** con mejoras incrementales
- 🛡️ **Robusto ante campos faltantes**
- 📈 **Escalable** para futuras funcionalidades

### **Beneficios**
1. **Sin interrupciones**: Backend sigue funcionando con otra UX
2. **Evolución gradual**: Se pueden agregar campos según necesidad
3. **Compatibilidad**: Frontend funciona con datos actuales
4. **Extensible**: Preparado para futuras funcionalidades