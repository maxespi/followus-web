// lib/mock-data.ts
import {
    User,
    Ticket,
    Channel,
    KnowledgeArticle,
    DashboardMetrics,
    ActivityLog,
    TicketMessage,
    NavigationItem
} from './types'

// Mock Users
export const mockUsers: User[] = [
    {
        id: 'user-1',
        name: 'Ana García',
        email: 'ana.garcia@example.com',
        avatar: '/placeholder-user.jpg',
        role: 'admin',
        status: 'online',
        lastSeen: new Date()
    },
    {
        id: 'user-2',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@example.com',
        avatar: '/placeholder-user.jpg',
        role: 'agent',
        status: 'online',
        lastSeen: new Date()
    },
    {
        id: 'user-3',
        name: 'María López',
        email: 'maria.lopez@example.com',
        avatar: '/placeholder-user.jpg',
        role: 'agent',
        status: 'busy',
        lastSeen: new Date(Date.now() - 300000) // 5 min ago
    },
    {
        id: 'customer-1',
        name: 'John Smith',
        email: 'john.smith@customer.com',
        role: 'customer',
        status: 'offline',
        lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
        id: 'customer-2',
        name: 'Sophie Martin',
        email: 'sophie.martin@customer.com',
        role: 'customer',
        status: 'online',
        lastSeen: new Date()
    }
]

// Mock Ticket Messages
export const mockTicketMessages: TicketMessage[] = [
    {
        id: 'msg-1',
        ticketId: 'TK-2024-001',
        sender: mockUsers[3], // customer
        content: 'Tengo problemas para acceder a mi cuenta desde esta mañana.',
        type: 'message',
        createdAt: new Date(Date.now() - 7200000) // 2 hours ago
    },
    {
        id: 'msg-2',
        ticketId: 'TK-2024-001',
        sender: mockUsers[1], // agent
        content: 'Gracias por contactarnos. Voy a revisar tu cuenta y te ayudo de inmediato.',
        type: 'message',
        createdAt: new Date(Date.now() - 7000000)
    },
    {
        id: 'msg-3',
        ticketId: 'TK-2024-001',
        sender: mockUsers[1], // agent
        content: 'He verificado tu cuenta y todo parece estar en orden. ¿Podrías intentar limpiar la caché de tu navegador?',
        type: 'message',
        createdAt: new Date(Date.now() - 3600000) // 1 hour ago
    }
]

// Mock Tickets
export const mockTickets: Ticket[] = [
    {
        id: 'TK-2024-001',
        title: 'No puedo acceder a mi cuenta',
        description: 'Al intentar iniciar sesión aparece un error de credenciales incorrectas, pero estoy seguro de que la contraseña es correcta.',
        status: 'in-progress',
        priority: 'high',
        channel: 'email',
        customer: mockUsers[3],
        assignee: mockUsers[1],
        category: 'Acceso y Autenticación',
        tags: ['login', 'password', 'access'],
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
        sla: '2h remaining',
        messages: mockTicketMessages.filter(m => m.ticketId === 'TK-2024-001')
    },
    {
        id: 'TK-2024-002',
        title: 'Facturación incorrecta',
        description: 'Mi última factura incluye cargos que no reconozco. Necesito una explicación detallada.',
        status: 'open',
        priority: 'medium',
        channel: 'chat',
        customer: mockUsers[4],
        assignee: mockUsers[2],
        category: 'Facturación',
        tags: ['billing', 'charges', 'review'],
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        sla: '4h remaining',
        messages: []
    },
    {
        id: 'TK-2024-003',
        title: 'Solicitud de nueva funcionalidad',
        description: 'Me gustaría sugerir la implementación de notificaciones push para la aplicación móvil.',
        status: 'waiting',
        priority: 'low',
        channel: 'web',
        customer: mockUsers[3],
        category: 'Funcionalidades',
        tags: ['feature-request', 'mobile', 'notifications'],
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 43200000), // 12 hours ago
        sla: '2d remaining',
        messages: []
    },
    {
        id: 'TK-2024-004',
        title: 'Error en sincronización de datos',
        description: 'Los cambios que hago en la aplicación web no se reflejan en la aplicación móvil.',
        status: 'resolved',
        priority: 'high',
        channel: 'phone',
        customer: mockUsers[4],
        assignee: mockUsers[1],
        category: 'Técnico',
        tags: ['sync', 'data', 'mobile', 'web'],
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000), // 1 day ago
        resolvedAt: new Date(Date.now() - 86400000),
        sla: 'Met',
        messages: []
    },
    {
        id: 'TK-2024-005',
        title: 'Problema con pagos',
        description: 'Mi tarjeta de crédito fue rechazada al intentar renovar mi suscripción, pero el banco confirma que no hay problemas.',
        status: 'open',
        priority: 'urgent',
        channel: 'email',
        customer: mockUsers[3],
        category: 'Pagos',
        tags: ['payment', 'subscription', 'card', 'renewal'],
        createdAt: new Date(Date.now() - 1800000), // 30 min ago
        updatedAt: new Date(Date.now() - 1800000),
        sla: '1h remaining',
        messages: []
    }
]

// Mock Channels
export const mockChannels: Channel[] = [
    {
        id: 'email-channel',
        name: 'Email Support',
        type: 'email',
        status: 'active',
        settings: {
            autoAssign: true,
            defaultPriority: 'medium',
            businessHours: {
                timezone: 'America/Santiago',
                days: {
                    monday: { enabled: true, start: '09:00', end: '18:00' },
                    tuesday: { enabled: true, start: '09:00', end: '18:00' },
                    wednesday: { enabled: true, start: '09:00', end: '18:00' },
                    thursday: { enabled: true, start: '09:00', end: '18:00' },
                    friday: { enabled: true, start: '09:00', end: '18:00' },
                    saturday: { enabled: false, start: '09:00', end: '18:00' },
                    sunday: { enabled: false, start: '09:00', end: '18:00' }
                }
            },
            autoResponse: true,
            escalationRules: []
        },
        stats: {
            totalTickets: 245,
            avgResponseTime: 2.5,
            satisfactionScore: 4.2,
            activeConversations: 12
        }
    },
    {
        id: 'chat-channel',
        name: 'Live Chat',
        type: 'chat',
        status: 'active',
        settings: {
            autoAssign: true,
            defaultPriority: 'high',
            businessHours: {
                timezone: 'America/Santiago',
                days: {
                    monday: { enabled: true, start: '08:00', end: '20:00' },
                    tuesday: { enabled: true, start: '08:00', end: '20:00' },
                    wednesday: { enabled: true, start: '08:00', end: '20:00' },
                    thursday: { enabled: true, start: '08:00', end: '20:00' },
                    friday: { enabled: true, start: '08:00', end: '20:00' },
                    saturday: { enabled: true, start: '10:00', end: '16:00' },
                    sunday: { enabled: false, start: '10:00', end: '16:00' }
                }
            },
            autoResponse: true,
            escalationRules: []
        },
        stats: {
            totalTickets: 89,
            avgResponseTime: 0.5,
            satisfactionScore: 4.6,
            activeConversations: 5
        }
    }
]

// Mock Knowledge Articles
export const mockKnowledgeArticles: KnowledgeArticle[] = [
    {
        id: 'kb-1',
        title: 'Cómo restablecer tu contraseña',
        content: '# Restablecer Contraseña\n\nSigue estos pasos para restablecer tu contraseña:\n\n1. Ve a la página de inicio de sesión\n2. Haz clic en "¿Olvidaste tu contraseña?"\n3. Ingresa tu email\n4. Revisa tu bandeja de entrada...',
        category: 'Acceso y Autenticación',
        tags: ['password', 'reset', 'login'],
        author: mockUsers[0],
        status: 'published',
        views: 1250,
        helpful: 98,
        notHelpful: 12,
        createdAt: new Date(Date.now() - 604800000), // 1 week ago
        updatedAt: new Date(Date.now() - 86400000)   // 1 day ago
    },
    {
        id: 'kb-2',
        title: 'Entender tu facturación',
        content: '# Facturación\n\nEste artículo explica cómo interpretar tu factura mensual...',
        category: 'Facturación',
        tags: ['billing', 'invoice', 'charges'],
        author: mockUsers[1],
        status: 'published',
        views: 890,
        helpful: 76,
        notHelpful: 8,
        createdAt: new Date(Date.now() - 1209600000), // 2 weeks ago
        updatedAt: new Date(Date.now() - 172800000)   // 2 days ago
    }
]

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
    totalTickets: 1247,
    openTickets: 89,
    resolvedToday: 23,
    avgResponseTime: 1.8,
    satisfactionScore: 4.3,
    activeAgents: 12,
    pendingTickets: 15,
    escalatedTickets: 3,
    ticketsByChannel: {
        email: 45,
        chat: 23,
        phone: 12,
        social: 8,
        web: 1
    },
    ticketsByPriority: {
        urgent: 5,
        high: 18,
        medium: 42,
        low: 24
    },
    recentActivity: [
        {
            id: 'activity-1',
            type: 'ticket_created',
            user: mockUsers[3],
            description: 'Nuevo ticket creado: "Problema con pagos"',
            timestamp: new Date(Date.now() - 1800000) // 30 min ago
        },
        {
            id: 'activity-2',
            type: 'ticket_resolved',
            user: mockUsers[1],
            description: 'Ticket TK-2024-004 resuelto',
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
            id: 'activity-3',
            type: 'user_login',
            user: mockUsers[2],
            description: 'María López inició sesión',
            timestamp: new Date(Date.now() - 7200000) // 2 hours ago
        }
    ]
}

// Mock Navigation
export const mockNavigation: NavigationItem[] = [
    {
        name: 'Dashboard',
        nameKey: 'nav.dashboard',
        href: '/',
        icon: 'LayoutDashboard'
    },
    {
        name: 'Tickets',
        nameKey: 'nav.tickets',
        href: '/tickets',
        icon: 'Ticket',
        badge: mockDashboardMetrics.openTickets
    },
    {
        name: 'Channels',
        nameKey: 'nav.channels',
        href: '/channels',
        icon: 'MessageSquare'
    },
    {
        name: 'Knowledge Base',
        nameKey: 'nav.knowledge',
        href: '/knowledge',
        icon: 'BookOpen'
    },
    {
        name: 'Analytics',
        nameKey: 'nav.analytics',
        href: '/analytics',
        icon: 'BarChart3'
    },
    {
        name: 'Users',
        nameKey: 'nav.users',
        href: '/users',
        icon: 'Users'
    },
    {
        name: 'Security',
        nameKey: 'nav.security',
        href: '/security',
        icon: 'Shield'
    },
    {
        name: 'Settings',
        nameKey: 'nav.settings',
        href: '/settings',
        icon: 'Settings'
    }
]

// Helper functions para obtener datos
export const getTicketById = (id: string): Ticket | undefined => {
    return mockTickets.find(ticket => ticket.id === id)
}

export const getTicketsByStatus = (status: Ticket['status']): Ticket[] => {
    return mockTickets.filter(ticket => ticket.status === status)
}

export const getTicketsByAssignee = (assigneeId: string): Ticket[] => {
    return mockTickets.filter(ticket => ticket.assignee?.id === assigneeId)
}

export const getUserById = (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id)
}

export const getChannelById = (id: string): Channel | undefined => {
    return mockChannels.find(channel => channel.id === id)
}

export const getKnowledgeArticleById = (id: string): KnowledgeArticle | undefined => {
    return mockKnowledgeArticles.find(article => article.id === id)
}
