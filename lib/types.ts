// lib/types.ts
export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: 'admin' | 'agent' | 'customer'
    status: 'online' | 'offline' | 'busy'
    lastSeen?: Date
}

export interface Ticket {
    id: string
    title: string
    description: string
    status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    channel: 'email' | 'chat' | 'phone' | 'social' | 'web'
    customer: User
    assignee?: User
    category: string
    tags: string[]
    createdAt: Date
    updatedAt: Date
    resolvedAt?: Date
    sla: string
    messages: TicketMessage[]
}

export interface TicketMessage {
    id: string
    ticketId: string
    sender: User
    content: string
    type: 'message' | 'note' | 'system'
    attachments?: Attachment[]
    createdAt: Date
}

export interface Attachment {
    id: string
    name: string
    url: string
    type: string
    size: number
}

export interface Channel {
    id: string
    name: string
    type: 'email' | 'chat' | 'phone' | 'social' | 'web'
    status: 'active' | 'inactive'
    settings: ChannelSettings
    stats: ChannelStats
}

export interface ChannelSettings {
    autoAssign: boolean
    defaultPriority: Ticket['priority']
    businessHours: BusinessHours
    autoResponse: boolean
    escalationRules: EscalationRule[]
}

export interface BusinessHours {
    timezone: string
    days: {
        [key: string]: {
            enabled: boolean
            start: string
            end: string
        }
    }
}

export interface EscalationRule {
    id: string
    condition: string
    action: string
    timeLimit: number
}

export interface ChannelStats {
    totalTickets: number
    avgResponseTime: number
    satisfactionScore: number
    activeConversations: number
}

export interface KnowledgeArticle {
    id: string
    title: string
    content: string
    category: string
    tags: string[]
    author: User
    status: 'draft' | 'published' | 'archived'
    views: number
    helpful: number
    notHelpful: number
    createdAt: Date
    updatedAt: Date
}

export interface DashboardMetrics {
    totalTickets: number
    openTickets: number
    resolvedToday: number
    avgResponseTime: number
    satisfactionScore: number
    activeAgents: number
    pendingTickets: number
    escalatedTickets: number
    ticketsByChannel: Record<string, number>
    ticketsByPriority: Record<string, number>
    recentActivity: ActivityLog[]
}

export interface ActivityLog {
    id: string
    type: 'ticket_created' | 'ticket_assigned' | 'ticket_resolved' | 'user_login' | 'system_alert'
    user: User
    description: string
    timestamp: Date
    metadata?: Record<string, any>
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'system'
    language: 'en' | 'es'
    notifications: NotificationSettings
    workingHours: BusinessHours
}

export interface NotificationSettings {
    email: boolean
    desktop: boolean
    sound: boolean
    newTickets: boolean
    mentions: boolean
    escalations: boolean
}

// Navigation types
export interface NavigationItem {
    name: string
    nameKey: string // Para i18n
    href: string
    icon: string
    current?: boolean
    badge?: number
    children?: NavigationItem[]
}

// API Response types
export interface ApiResponse<T> {
    data: T
    message?: string
    status: 'success' | 'error'
    errors?: string[]
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

// Form types
export interface CreateTicketForm {
    title: string
    description: string
    priority: Ticket['priority']
    channel: Ticket['channel']
    category: string
    tags: string[]
    customerId?: string
}

export interface UpdateTicketForm {
    title?: string
    description?: string
    status?: Ticket['status']
    priority?: Ticket['priority']
    assigneeId?: string
    tags?: string[]
}

// Filter types
export interface TicketFilters {
    status?: Ticket['status'][]
    priority?: Ticket['priority'][]
    channel?: Ticket['channel'][]
    assignee?: string[]
    customer?: string[]
    category?: string[]
    tags?: string[]
    dateRange?: {
        start: Date
        end: Date
    }
    search?: string
}

export interface UserFilters {
    role?: User['role'][]
    status?: User['status'][]
    search?: string
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system'
export type Language = 'en' | 'es'
