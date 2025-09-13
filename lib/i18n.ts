// lib/i18n.ts
export type Language = 'en' | 'es'

export interface Translations {
    [key: string]: string | Translations
}

// Traducciones en español
export const esTranslations: Translations = {
    // Navegación
    nav: {
        dashboard: 'Panel Principal',
        tickets: 'Tickets',
        channels: 'Canales',
        knowledge: 'Base de Conocimiento',
        analytics: 'Análisis',
        users: 'Usuarios',
        security: 'Seguridad',
        settings: 'Configuración'
    },

    // Header
    header: {
        search: 'Buscar...',
        notifications: 'Notificaciones',
        profile: 'Perfil',
        logout: 'Cerrar Sesión',
        language: 'Idioma',
        theme: 'Tema',
        lightMode: 'Modo Claro',
        darkMode: 'Modo Oscuro',
        systemMode: 'Sistema'
    },

    // Dashboard
    dashboard: {
        title: 'Panel Principal',
        subtitle: 'Resumen de actividad y métricas clave del sistema',
        totalTickets: 'Total de Tickets',
        openTickets: 'Tickets Abiertos',
        resolvedToday: 'Resueltos Hoy',
        avgResponseTime: 'Tiempo de Respuesta Promedio',
        satisfactionScore: 'Puntuación de Satisfacción',
        activeAgents: 'Agentes Activos',
        pendingTickets: 'Tickets Pendientes',
        escalatedTickets: 'Tickets Escalados',
        recentActivity: 'Actividad Reciente',
        ticketsByChannel: 'Tickets por Canal',
        ticketsByPriority: 'Tickets por Prioridad'
    },

    // Tickets
    tickets: {
        title: 'Gestión de Tickets',
        subtitle: 'Gestiona y rastrea tickets de soporte al cliente en todos los canales',
        newTicket: 'Nuevo Ticket',
        search: 'Buscar tickets, clientes o IDs...',
        filters: 'Filtros y Búsqueda',
        status: 'Estado',
        priority: 'Prioridad',
        channel: 'Canal',
        assignee: 'Asignado a',
        customer: 'Cliente',
        created: 'Creado',
        updated: 'Actualizado',
        listView: 'Vista de Lista',
        kanbanBoard: 'Tablero Kanban',
        ticketDetails: 'Detalles del Ticket',

        // Estados
        open: 'Abierto',
        'in-progress': 'En Progreso',
        waiting: 'En Espera',
        resolved: 'Resuelto',
        closed: 'Cerrado',

        // Prioridades
        urgent: 'Urgente',
        high: 'Alta',
        medium: 'Media',
        low: 'Baja',

        // Canales
        email: 'Email',
        chat: 'Chat',
        phone: 'Teléfono',
        social: 'Redes Sociales',
        web: 'Web',

        // Acciones
        assign: 'Asignar',
        resolve: 'Resolver',
        close: 'Cerrar',
        escalate: 'Escalar',
        addNote: 'Agregar Nota',
        viewHistory: 'Ver Historial'
    },

    // Canales
    channels: {
        title: 'Gestión de Canales',
        subtitle: 'Configura y administra canales de comunicación',
        newChannel: 'Nuevo Canal',
        configuration: 'Configuración',
        statistics: 'Estadísticas',
        active: 'Activo',
        inactive: 'Inactivo',
        autoAssign: 'Asignación Automática',
        autoResponse: 'Respuesta Automática',
        businessHours: 'Horario Comercial',
        escalationRules: 'Reglas de Escalación'
    },

    // Base de Conocimiento
    knowledge: {
        title: 'Base de Conocimiento',
        subtitle: 'Artículos y documentación para soporte',
        newArticle: 'Nuevo Artículo',
        search: 'Buscar artículos...',
        category: 'Categoría',
        author: 'Autor',
        status: 'Estado',
        views: 'Vistas',
        helpful: 'Útil',
        notHelpful: 'No Útil',

        // Estados de artículos
        draft: 'Borrador',
        published: 'Publicado',
        archived: 'Archivado',

        // Acciones
        edit: 'Editar',
        publish: 'Publicar',
        archive: 'Archivar',
        delete: 'Eliminar',
        preview: 'Vista Previa'
    },

    // Formularios comunes
    common: {
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        create: 'Crear',
        update: 'Actualizar',
        search: 'Buscar',
        filter: 'Filtrar',
        clear: 'Limpiar',
        all: 'Todos',
        none: 'Ninguno',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Información',
        confirm: 'Confirmar',
        yes: 'Sí',
        no: 'No',
        close: 'Cerrar',
        back: 'Volver',
        next: 'Siguiente',
        previous: 'Anterior',
        page: 'Página',
        of: 'de',
        showing: 'Mostrando',
        to: 'a',
        entries: 'entradas',
        noData: 'No hay datos disponibles',
        noResults: 'No se encontraron resultados'
    },

    // Mensajes del sistema
    messages: {
        ticketCreated: 'Ticket creado exitosamente',
        ticketUpdated: 'Ticket actualizado exitosamente',
        ticketDeleted: 'Ticket eliminado exitosamente',
        articleCreated: 'Artículo creado exitosamente',
        articleUpdated: 'Artículo actualizado exitosamente',
        settingsSaved: 'Configuración guardada exitosamente',
        errorOccurred: 'Ocurrió un error inesperado',
        invalidCredentials: 'Credenciales inválidas',
        accessDenied: 'Acceso denegado',
        sessionExpired: 'Sesión expirada'
    }
}

// Traducciones en inglés
export const enTranslations: Translations = {
    // Navigation
    nav: {
        dashboard: 'Dashboard',
        tickets: 'Tickets',
        channels: 'Channels',
        knowledge: 'Knowledge Base',
        analytics: 'Analytics',
        users: 'Users',
        security: 'Security',
        settings: 'Settings'
    },

    // Header
    header: {
        search: 'Search...',
        notifications: 'Notifications',
        profile: 'Profile',
        logout: 'Logout',
        language: 'Language',
        theme: 'Theme',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        systemMode: 'System'
    },

    // Dashboard
    dashboard: {
        title: 'Dashboard',
        subtitle: 'Activity overview and key system metrics',
        totalTickets: 'Total Tickets',
        openTickets: 'Open Tickets',
        resolvedToday: 'Resolved Today',
        avgResponseTime: 'Avg Response Time',
        satisfactionScore: 'Satisfaction Score',
        activeAgents: 'Active Agents',
        pendingTickets: 'Pending Tickets',
        escalatedTickets: 'Escalated Tickets',
        recentActivity: 'Recent Activity',
        ticketsByChannel: 'Tickets by Channel',
        ticketsByPriority: 'Tickets by Priority'
    },

    // Tickets
    tickets: {
        title: 'Ticket Management',
        subtitle: 'Manage and track customer support tickets across all channels',
        newTicket: 'New Ticket',
        search: 'Search tickets, customers, or IDs...',
        filters: 'Filters & Search',
        status: 'Status',
        priority: 'Priority',
        channel: 'Channel',
        assignee: 'Assignee',
        customer: 'Customer',
        created: 'Created',
        updated: 'Updated',
        listView: 'List View',
        kanbanBoard: 'Kanban Board',
        ticketDetails: 'Ticket Details',

        // Status
        open: 'Open',
        'in-progress': 'In Progress',
        waiting: 'Waiting',
        resolved: 'Resolved',
        closed: 'Closed',

        // Priorities
        urgent: 'Urgent',
        high: 'High',
        medium: 'Medium',
        low: 'Low',

        // Channels
        email: 'Email',
        chat: 'Chat',
        phone: 'Phone',
        social: 'Social Media',
        web: 'Web',

        // Actions
        assign: 'Assign',
        resolve: 'Resolve',
        close: 'Close',
        escalate: 'Escalate',
        addNote: 'Add Note',
        viewHistory: 'View History'
    },

    // Channels
    channels: {
        title: 'Channel Management',
        subtitle: 'Configure and manage communication channels',
        newChannel: 'New Channel',
        configuration: 'Configuration',
        statistics: 'Statistics',
        active: 'Active',
        inactive: 'Inactive',
        autoAssign: 'Auto Assign',
        autoResponse: 'Auto Response',
        businessHours: 'Business Hours',
        escalationRules: 'Escalation Rules'
    },

    // Knowledge Base
    knowledge: {
        title: 'Knowledge Base',
        subtitle: 'Articles and documentation for support',
        newArticle: 'New Article',
        search: 'Search articles...',
        category: 'Category',
        author: 'Author',
        status: 'Status',
        views: 'Views',
        helpful: 'Helpful',
        notHelpful: 'Not Helpful',

        // Article status
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',

        // Actions
        edit: 'Edit',
        publish: 'Publish',
        archive: 'Archive',
        delete: 'Delete',
        preview: 'Preview'
    },

    // Common forms
    common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        update: 'Update',
        search: 'Search',
        filter: 'Filter',
        clear: 'Clear',
        all: 'All',
        none: 'None',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        confirm: 'Confirm',
        yes: 'Yes',
        no: 'No',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        page: 'Page',
        of: 'of',
        showing: 'Showing',
        to: 'to',
        entries: 'entries',
        noData: 'No data available',
        noResults: 'No results found'
    },

    // System messages
    messages: {
        ticketCreated: 'Ticket created successfully',
        ticketUpdated: 'Ticket updated successfully',
        ticketDeleted: 'Ticket deleted successfully',
        articleCreated: 'Article created successfully',
        articleUpdated: 'Article updated successfully',
        settingsSaved: 'Settings saved successfully',
        errorOccurred: 'An unexpected error occurred',
        invalidCredentials: 'Invalid credentials',
        accessDenied: 'Access denied',
        sessionExpired: 'Session expired'
    }
}

// Función para obtener la traducción anidada
export function getNestedTranslation(
    translations: Translations,
    key: string
): string {
    const keys = key.split('.')
    let current: any = translations

    for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
            current = current[k]
        } else {
            return key // Devolver la key si no se encuentra la traducción
        }
    }

    return typeof current === 'string' ? current : key
}

// Contexto y hook para i18n
export const translations = {
    es: esTranslations,
    en: enTranslations
}

export function getTranslation(language: Language, key: string): string {
    return getNestedTranslation(translations[language], key)
}
