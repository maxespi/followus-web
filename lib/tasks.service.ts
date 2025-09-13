// lib/tasks.service.ts
import { apiService } from './api.service'

// Types based on backend Task API documentation
export interface Task {
  id: number
  detalleTask: string
  categoria: 'Proceso' | 'Calendario' | 'General'
  estado: 'disponible' | 'en_desarrollo' | 'en_revision' | 'archivado'
  createdAt: string
  updatedAt: string
  sidebar: 'left' | 'right' | 'center'
  clasificacion: 'U' | 'P' | 'N' | 'C'
  vistoPor: number[]
  fecha_hora_termino?: string
  fecha_hora_inicio?: string
  fecha_finalizacion?: string
  // Optional fields that may not be in basic responses
  tipo?: string
  latitude?: number
  longitude?: number
  creadorId?: number
  minutos?: number
  proceso?: string
  creador: {
    id: number
    nombre: string
    apellido: string
  }
  tasksusuarios?: Array<{
    id: number
    usuarioId: number
    privilegio: boolean
    rol?: string
    Usuario: {
      id: number
      nombre: string
      apellido: string
    }
  }>
  taskscomentarios?: Array<{
    id: number
    detalleTaskComentario: string
    parentId?: number
    nivel: number
    createdAt: string
    usuario: {
      id: number
      nombre: string
      apellido: string
    }
    reacciones?: Array<{
      id: number
      tipoReaccion: string
      Usuario: {
        id: number
        nombre: string
        apellido: string
      }
    }>
  }>
  tasksetapas?: Array<{
    id: number
    nombre: string
    cumplida: boolean
    observaciones?: string
    n_orden?: number
    atributos?: Array<{
      id: number
      nombre: string
      value?: string
      cumplida: boolean
      observaciones?: string
      n_orden?: number
    }>
  }>
  files?: Array<{
    id: number
    nombre: string
    url: string
  }>
  Hijas?: Array<{
    id: number
    detalleTask: string
  }>
  Padres?: Array<{
    id: number
    detalleTask: string
  }>
}

export interface TaskNotification {
  id: number
  detalleTask: string
  categoria: string
  sidebar: string
  updatedAt: string
  creador: {
    id: number
    nombre: string
    apellido: string
  }
  ultimoComentario?: {
    contenido: string
    usuario: {
      id: number
      nombre: string
      apellido: string
    }
    createdAt: string
  }
  tipoNotificacion: 'comment' | 'update'
}

// Frontend Ticket interface (mapped from Task)
export interface Ticket {
  id: number
  title: string
  description: string
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  channel: 'web' | 'email' | 'chat' | 'phone' | 'social'
  createdAt: string
  updatedAt: string
  fecha_finalizacion?: string // ✅ Nuevo campo para fecha real de finalización
  creator: {
    id: number
    name: string
    email?: string
  }
  assignedTo?: {
    id: number
    name: string
    role?: string
  }
  participants: Array<{
    id: number
    name: string
    role?: string
    hasPrivileges: boolean
  }>
  messages: Array<{
    id: number
    content: string
    author: {
      id: number
      name: string
    }
    createdAt: string
    isInternal: boolean
    // Enhanced: Nested comment structure
    parentId?: number
    level: number
    reactions: Array<{
      id: number
      type: string
      user: {
        id: number
        name: string
      }
    }>
  }>
  tags: string[]
  attachments: Array<{
    id: number
    name: string
    url: string
  }>
  // Backend specific fields
  coordinates?: {
    latitude?: number
    longitude?: number
  }
  duration?: number
  startDate?: string // Mapeo de fecha_hora_inicio
  process?: string
  sidebar?: string
  viewedBy: number[]
  parentTasks: Array<{ id: number; title: string }>
  childTasks: Array<{ id: number; title: string }>
  checklist: Array<{
    id: number
    title: string
    completed: boolean
    notes?: string
    order?: number
    attributes?: Array<{
      id: number
      name: string
      value?: string
      completed: boolean
      notes?: string
      order?: number
    }>
  }>
}

// Helper functions
const safeFieldAccess = (obj: any, path: string, defaultValue: any = null) => {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue
}

// Set para trackear estados ya logueados
const loggedUnknownStates = new Set<string>()

const mapTaskStateToTicketStatus = (taskState?: string | null): Ticket['status'] => {
  const mapping: Record<string, Ticket['status']> = {
    'disponible': 'open',
    'en_desarrollo': 'in_progress',
    'en_revision': 'pending',
    'archivado': 'resolved' // ✅ archivado = resolved (no closed)
  }

  // Handle null or undefined states (según documentación del backend)
  if (!taskState) {
    return 'open' // null/undefined = disponible = open
  }

  const mappedState = mapping[taskState]
  if (!mappedState) {
    // Solo log una vez por estado desconocido para evitar spam
    if (!loggedUnknownStates.has(taskState)) {
      console.warn(`⚠️ Estado no reconocido: "${taskState}", usando 'open' por defecto`)
      loggedUnknownStates.add(taskState)
    }
    return 'open'
  }
  return mappedState
}

// Set para trackear prioridades ya logueadas
const loggedUnknownPriorities = new Set<string>()

const mapTaskPriorityToTicketPriority = (taskClasificacion?: string | null): Ticket['priority'] => {
  const mapping: Record<string, Ticket['priority']> = {
    'U': 'urgent',    // Urgente
    'P': 'high',      // Prioritario
    'N': 'medium',    // Normal
    'C': 'low'        // Común
  }

  // Handle null or undefined priorities
  if (!taskClasificacion) {
    return 'medium' // Default priority
  }

  const mappedPriority = mapping[taskClasificacion]
  if (!mappedPriority) {
    // Solo log una vez por prioridad desconocida para evitar spam
    if (!loggedUnknownPriorities.has(taskClasificacion)) {
      console.warn(`⚠️ Clasificación no reconocida: "${taskClasificacion}", usando 'medium' por defecto`)
      loggedUnknownPriorities.add(taskClasificacion)
    }
    return 'medium'
  }
  return mappedPriority
}

const mapTaskToTicket = (task: Task): Ticket => {
  try {
    // 🔍 DEBUG: Verificar fechas que llegan del backend
    const dateFields = {
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      fecha_hora_inicio: task.fecha_hora_inicio,
      fecha_finalizacion: task.fecha_finalizacion
    }

    // Log solo la primera vez para debug
    if (!loggedUnknownStates.has('_date_debug_logged') && task.id === 1) {
      console.log('🗓️ Fechas desde backend para task', task.id, ':', dateFields)
      loggedUnknownStates.add('_date_debug_logged')
    }

    const ticket: Ticket = {
      // Basic mapping
      id: task.id,
      title: safeFieldAccess(task, 'detalleTask', 'Sin título'),
      description: safeFieldAccess(task, 'detalleTask', ''),
      status: mapTaskStateToTicketStatus(task.estado),
      priority: mapTaskPriorityToTicketPriority(task.clasificacion),
      category: safeFieldAccess(task, 'categoria', 'General'),
      channel: 'web', // Default since backend doesn't have channel yet

      // 🗓️ Fechas: mapeo directo del backend con fallback
      createdAt: task.createdAt,
      updatedAt: task.updatedAt || task.createdAt, // Fallback si updatedAt no existe
      fecha_finalizacion: task.fecha_finalizacion, // ✅ Fecha de finalización real

      // Creator mapping - handle missing creator gracefully
      creator: {
        id: safeFieldAccess(task, 'creador.id', 0),
        name: `${safeFieldAccess(task, 'creador.nombre', '')} ${safeFieldAccess(task, 'creador.apellido', '')}`.trim() || 'Usuario desconocido',
        email: 'No disponible' // Backend doesn't include email in task response
      },

      // Assigned user (find 'jefe tarea' role) - handle missing participants
      assignedTo: (() => {
        const jefeTarea = task.tasksusuarios?.find(tu => tu.rol === 'jefe tarea')
        if (jefeTarea?.Usuario) {
          return {
            id: jefeTarea.Usuario.id,
            name: `${jefeTarea.Usuario.nombre || ''} ${jefeTarea.Usuario.apellido || ''}`.trim() || 'Usuario desconocido',
            role: 'jefe tarea'
          }
        }
        return undefined
      })(),

      // Participants mapping - handle missing participants
      participants: task.tasksusuarios?.map(tu => ({
        id: safeFieldAccess(tu, 'Usuario.id', 0),
        name: `${safeFieldAccess(tu, 'Usuario.nombre', '')} ${safeFieldAccess(tu, 'Usuario.apellido', '')}`.trim() || 'Usuario desconocido',
        role: tu.rol,
        hasPrivileges: tu.privilegio || false
      })) || [],

    // Messages mapping (from comments) - Enhanced with nested structure
    messages: task.taskscomentarios?.map(comment => ({
      id: comment.id,
      content: safeFieldAccess(comment, 'detalleTaskComentario', ''),
      author: {
        id: comment.usuario.id,
        name: `${comment.usuario.nombre || ''} ${comment.usuario.apellido || ''}`.trim() || 'Usuario desconocido'
      },
      createdAt: comment.createdAt,
      isInternal: false, // Could be enhanced based on clasificacion
      // Enhanced: Nested comment structure
      parentId: comment.parentId,
      level: comment.nivel,
      reactions: comment.reacciones?.map(reaction => ({
        id: reaction.id,
        type: reaction.tipoReaccion,
        user: {
          id: reaction.Usuario.id,
          name: `${reaction.Usuario.nombre} ${reaction.Usuario.apellido}`.trim()
        }
      })) || []
    })) || [],

    // Simple mappings
    tags: task.categoria ? [task.categoria] : [],
    attachments: task.files?.map(file => ({
      id: file.id,
      name: file.nombre,
      url: file.url
    })) || [],

    // Backend specific fields
    coordinates: {
      latitude: task.latitude,
      longitude: task.longitude
    },
    duration: task.minutos,
    // 🗓️ startDate: usar fecha_hora_inicio si existe y es diferente a createdAt, sino null
    startDate: task.fecha_hora_inicio && task.fecha_hora_inicio !== task.createdAt ?
      task.fecha_hora_inicio : undefined,
    process: task.proceso,
    sidebar: task.sidebar,
    viewedBy: task.vistoPor || [],

    // Hierarchical relationships
    parentTasks: task.Padres?.map(parent => ({
      id: parent.id,
      title: parent.detalleTask
    })) || [],
    childTasks: task.Hijas?.map(child => ({
      id: child.id,
      title: child.detalleTask
    })) || [],

    // Checklist from tasksetapas
    checklist: task.tasksetapas?.map(etapa => ({
      id: etapa.id,
      title: etapa.nombre,
      completed: etapa.cumplida,
      notes: etapa.observaciones,
      order: etapa.n_orden,
      attributes: etapa.atributos?.map(attr => ({
        id: attr.id,
        name: attr.nombre,
        value: attr.value,
        completed: attr.cumplida,
        notes: attr.observaciones,
        order: attr.n_orden
      })) || []
    })) || []
  }

    // Logging solo para errores críticos

    return ticket
  } catch (error) {
    console.error('Error mapping task to ticket:', error, 'Task:', task)
    // Return a minimal valid ticket to prevent complete failure
    return {
      id: task.id || 0,
      title: task.detalleTask || 'Error en mapeo',
      description: task.detalleTask || '',
      status: 'open',
      priority: 'medium',
      category: 'error',
      channel: 'web',
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt || new Date().toISOString(),
      fecha_finalizacion: task.fecha_finalizacion,
      creator: {
        id: 0,
        name: 'Error en mapeo',
        email: 'No disponible'
      },
      participants: [],
      messages: [],
      tags: [],
      attachments: [],
      coordinates: {},
      viewedBy: [],
      parentTasks: [],
      childTasks: [],
      checklist: []
    }
  }
}

class TasksService {
  // Get user tasks (tickets)
  async getUserTasks(userId: number): Promise<Ticket[]> {
    try {
      const response = await apiService.makeRequest<Task[]>(`/tasks/tasksdelusuario/${userId}`)

      // El backend está devolviendo el array directamente en lugar de { success: true, data: [...] }
      if (Array.isArray(response)) {
        // Log resumen de estados
        const estadosCounts = response.reduce((acc, task) => {
          const estado = task.estado || 'null'
          acc[estado] = (acc[estado] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // Log ejemplo de formato de fecha (solo la primera vez)
        if (!loggedUnknownStates.has('_fecha_ejemplo_logged')) {
          const taskConFechas = response.find(t => t.createdAt && t.updatedAt)
          if (taskConFechas) {
            console.log(`📅 Formato fechas:`, {
              id: taskConFechas.id,
              createdAt: taskConFechas.createdAt,
              updatedAt: taskConFechas.updatedAt,
              fecha_finalizacion: taskConFechas.fecha_finalizacion || 'null'
            })
            loggedUnknownStates.add('_fecha_ejemplo_logged')
          }
        }

        const mappedTickets = response.map(mapTaskToTicket)
        console.log(`✅ Mapeados ${mappedTickets.length} tickets exitosamente`)
        return mappedTickets
      }

      // Formato esperado: { success: true, data: [...] }
      if (response.success && Array.isArray(response.data)) {
        const mappedTickets = response.data.map(mapTaskToTicket)
        return mappedTickets
      }

      console.error('❌ Formato de respuesta inválido:', response)
      return []
    } catch (error) {
      console.error('❌ Error cargando tasks del usuario:', error)
      throw error
    }
  }

  // Get user notifications
  async getUserNotifications(userId: number): Promise<TaskNotification[]> {
    try {
      console.log('Fetching notifications for user:', userId)
      const response = await apiService.makeRequest<TaskNotification[]>(`/tasks/notificaciones/${userId}`)

      if (response.success && Array.isArray(response.data)) {
        return response.data
      }

      console.warn('Invalid response format for notifications:', response)
      return []
    } catch (error) {
      console.error('Error fetching user notifications:', error)
      throw error
    }
  }

  // Get single task/ticket
  async getTask(taskId: number): Promise<Ticket | null> {
    try {
      console.log('Fetching task:', taskId)
      const response = await apiService.makeRequest<Task>(`/tasks/${taskId}`)

      // El backend puede retornar la tarea directamente o con wrapper
      let taskData: Task | null = null

      if (response.success && response.data) {
        // Formato con wrapper: { success: true, data: {...} }
        taskData = response.data
      } else if (response.id && response.detalleTask) {
        // Formato directo: el response ES la tarea (detectado por id + detalleTask)
        taskData = response as Task
      }

      if (taskData) {
        console.log('✅ Task loaded successfully:', taskData.id)
        return mapTaskToTicket(taskData)
      }

      console.warn('❌ Task not found or invalid response:', response)
      return null
    } catch (error) {
      console.error('Error fetching task:', error)
      throw error
    }
  }

  // Create new task/ticket
  async createTask(taskData: Partial<Task>): Promise<Ticket | null> {
    try {
      console.log('Creating task:', taskData)
      const response = await apiService.makeRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      })

      if (response.success && response.data) {
        // Backend returns limited data on creation, fetch full task
        return await this.getTask(response.data.id)
      }

      console.warn('Failed to create task:', response)
      return null
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  // Update task/ticket
  async updateTask(taskId: number, updates: Partial<Task>): Promise<Ticket | null> {
    try {
      console.log('Updating task:', taskId, updates)
      const response = await apiService.makeRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })

      if (response.success) {
        // Fetch updated task
        return await this.getTask(taskId)
      }

      console.warn('Failed to update task:', response)
      return null
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  // Delete task/ticket
  async deleteTask(taskId: number): Promise<boolean> {
    try {
      console.log('Deleting task:', taskId)
      const response = await apiService.makeRequest(`/tasks/${taskId}`, {
        method: 'DELETE'
      })

      return response.success || false
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  // Add comment to task
  async addComment(taskId: number, comment: string, clasificacion: string = ''): Promise<boolean> {
    try {
      console.log('Adding comment to task:', taskId)
      const response = await apiService.makeRequest('/tasks/comentario', {
        method: 'POST',
        body: JSON.stringify({
          taskId,
          detalleTaskComentario: comment,
          clasificacion
        })
      })

      return response.success || false
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  // Mark task as viewed
  async markAsViewed(taskId: number): Promise<boolean> {
    try {
      console.log('Marking task as viewed:', taskId)
      const response = await apiService.makeRequest(`/tasks/marcar-vista/${taskId}`, {
        method: 'PUT'
      })

      return response.success || false
    } catch (error) {
      console.error('Error marking task as viewed:', error)
      throw error
    }
  }

  // Get dashboard statistics (simplified version)
  async getDashboardStats(userId: number): Promise<any> {
    try {
      // Since there's no specific stats endpoint, we'll derive from user tasks
      const tickets = await this.getUserTasks(userId)

      const stats = {
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'open').length,
        inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
        resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        ticketsByCategory: tickets.reduce((acc, ticket) => {
          acc[ticket.category] = (acc[ticket.category] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        ticketsByStatus: tickets.reduce((acc, ticket) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }

      return stats
    } catch (error) {
      console.error('Error calculating dashboard stats:', error)
      return {
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
        ticketsByCategory: {},
        ticketsByStatus: {}
      }
    }
  }
}

// Export singleton instance
export const tasksService = new TasksService()
export default tasksService
