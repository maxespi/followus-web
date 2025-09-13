// components/ticket-management.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslation, useAuth } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Plus,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  Mail,
  MessageSquare,
  Phone,
  Share,
  Globe,
  User,
  Calendar
} from 'lucide-react'
import { tasksService, Ticket } from '@/lib/tasks.service'
import { TicketDetails } from '@/components/ticket-details'
import { NewTicketDialog } from '@/components/new-ticket-dialog'
import { formatRelativeTime, formatDate } from '@/lib/date-utils'
import { useTicketMetrics } from '@/hooks/use-ticket-metrics'

// Funciones helper para iconos y colores
const getChannelIcon = (channel: string) => {
  const iconMap = {
    email: <Mail className="h-4 w-4" />,
    chat: <MessageSquare className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />,
    social: <Share className="h-4 w-4" />,
    web: <Globe className="h-4 w-4" />
  }
  return iconMap[channel as keyof typeof iconMap] || <Mail className="h-4 w-4" />
}

const getPriorityColor = (priority: string) => {
  const colorMap = {
    urgent: 'destructive',
    high: 'destructive',
    medium: 'default',
    low: 'secondary'
  }
  return colorMap[priority as keyof typeof colorMap] || 'default'
}

const getStatusColor = (status: string) => {
  const colorMap = {
    open: 'destructive',
    'in-progress': 'default',
    waiting: 'secondary',
    resolved: 'secondary',
    closed: 'outline'
  }
  return colorMap[status as keyof typeof colorMap] || 'default'
}

interface TicketFilters {
  search: string
  status: string[]
  priority: string[]
  channel: string[]
  assignee: string[]
}

export function TicketManagement() {
  const { t } = useTranslation()
  const { user } = useAuth()

  // Estados de datos
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados locales
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [activeTab, setActiveTab] = useState('list')

  // Debug hooks removidos - usar solo para desarrollo local si necesario

  // Estados de filtros
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: [],
    priority: [],
    channel: [],
    assignee: []
  })

  // Hook centralizado para métricas
  const metrics = useTicketMetrics(tickets)

  // Cargar lista eficiente de tickets (datos reducidos)
  const loadTickets = async () => {
    if (!user?.id) return

    try {
      setError(null)
      setLoading(true)
      const userTickets = await tasksService.getUserTasks(Number(user.id))
      setTickets(userTickets)

      // Seleccionar el primer ticket si no hay ninguno seleccionado
      if (!selectedTicket && userTickets.length > 0) {
        // Cargar detalle completo del primer ticket
        await loadTicketDetail(userTickets[0].id)
      }
    } catch (err) {
      console.error('❌ Error cargando tickets:', err)
      setError('Error al cargar los tickets')
    } finally {
      setLoading(false)
    }
  }

  // Cargar detalle completo de un ticket específico (todos los datos)
  const loadTicketDetail = async (ticketId: number) => {
    try {
      const fullTicketData = await tasksService.getTask(ticketId)
      if (fullTicketData) {
        // Actualizar tanto la lista como el ticket seleccionado con datos completos
        setTickets(prev => prev.map(ticket =>
          ticket.id === ticketId ? fullTicketData : ticket
        ))
        setSelectedTicket(fullTicketData)
      }
    } catch (err) {
      console.error('❌ Error cargando detalle del ticket:', err)
      // Mantener funcionamiento básico aunque falle la carga de detalles
    }
  }

  useEffect(() => {
    loadTickets()
  }, [user?.id])

  // Tickets filtrados (para vista de lista - excluir resueltos)
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Filtro de búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
            ticket.id.toString().toLowerCase().includes(searchLower) ||
            ticket.title.toLowerCase().includes(searchLower) ||
            ticket.creator.name.toLowerCase().includes(searchLower) ||
            ticket.creator.email?.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Filtros de estado
      if (filters.status && filters.status.length > 0 && !filters.status.includes(ticket.status)) {
        return false
      }

      // Filtros de prioridad
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(ticket.priority)) {
        return false
      }

      // Filtros de canal
      if (filters.channel && filters.channel.length > 0 && !filters.channel.includes(ticket.channel)) {
        return false
      }

      // Filtros de asignado
      if (filters.assignee && filters.assignee.length > 0 && ticket.assignedTo && !filters.assignee.includes(ticket.assignedTo.id.toString())) {
        return false
      }

      return true
    })
  }, [tickets, filters])

  // Tickets para Kanban (incluye todos los estados)
  const kanbanTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Mismos filtros pero incluye resueltos
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
            ticket.id.toString().toLowerCase().includes(searchLower) ||
            ticket.title.toLowerCase().includes(searchLower) ||
            ticket.creator.name.toLowerCase().includes(searchLower) ||
            ticket.creator.email?.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      if (filters.status && filters.status.length > 0 && !filters.status.includes(ticket.status)) {
        return false
      }

      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(ticket.priority)) {
        return false
      }

      if (filters.channel && filters.channel.length > 0 && !filters.channel.includes(ticket.channel)) {
        return false
      }

      if (filters.assignee && filters.assignee.length > 0 && ticket.assignedTo && !filters.assignee.includes(ticket.assignedTo.id.toString())) {
        return false
      }

      return true
    })
  }, [tickets, filters])

  // Tickets para lista (excluye resueltos)
  const listTickets = useMemo(() => {
    return filteredTickets.filter(ticket => ticket.status !== 'resolved')
  }, [filteredTickets])

  // Manejadores de eventos
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleFilterChange = (key: keyof TicketFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? [] : [value] }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: [],
      priority: [],
      channel: [],
      assignee: []
    })
  }


  if (error) {
    return (
      <div className="h-full flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold">{t('tickets.title')}</h1>
            <p className="text-muted-foreground text-red-500">{error}</p>
          </div>
          <Button onClick={loadTickets} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold">{t('tickets.title')}</h1>
            <p className="text-muted-foreground">
              {loading ? 'Cargando tickets...' : t('tickets.subtitle')}
            </p>
          </div>
          <Button onClick={() => setShowNewTicket(true)} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            {t('tickets.newTicket')}
          </Button>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="flex-shrink-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('tickets.filters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Búsqueda */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                      placeholder={t('tickets.search')}
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9"
                  />
                </div>
              </div>

              {/* Filtro de Estado */}
              <Select onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('tickets.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="open">{t('tickets.open')}</SelectItem>
                  <SelectItem value="in_progress">{t('tickets.in_progress')}</SelectItem>
                  <SelectItem value="pending">{t('tickets.pending')}</SelectItem>
                  <SelectItem value="resolved">{t('tickets.resolved')}</SelectItem>
                  <SelectItem value="closed">{t('tickets.closed')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro de Prioridad */}
              <Select onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('tickets.priority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="urgent">{t('tickets.urgent')}</SelectItem>
                  <SelectItem value="high">{t('tickets.high')}</SelectItem>
                  <SelectItem value="medium">{t('tickets.medium')}</SelectItem>
                  <SelectItem value="low">{t('tickets.low')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro de Canal */}
              <Select onValueChange={(value) => handleFilterChange('channel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('tickets.channel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="email">{t('tickets.email')}</SelectItem>
                  <SelectItem value="chat">{t('tickets.chat')}</SelectItem>
                  <SelectItem value="phone">{t('tickets.phone')}</SelectItem>
                  <SelectItem value="social">{t('tickets.social')}</SelectItem>
                  <SelectItem value="web">{t('tickets.web')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Botón limpiar filtros */}
              <Button variant="outline" onClick={clearFilters}>
                {t('common.clear')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Vista - Ocupa el resto del espacio */}
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="flex-shrink-0 grid w-full grid-cols-3">
              <TabsTrigger value="list">{t('tickets.listView')}</TabsTrigger>
              <TabsTrigger value="kanban">{t('tickets.kanbanBoard')}</TabsTrigger>
              <TabsTrigger value="details">{t('tickets.ticketDetails')}</TabsTrigger>
            </TabsList>

            {/* Vista de Lista */}
            <TabsContent value="list" className="flex-1 mt-4">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                {/* Lista de Tickets - Ocupa más espacio en pantallas grandes */}
                <div className="xl:col-span-2 flex flex-col">
                  <Card className="flex-1 flex flex-col">
                    <CardHeader className="flex-shrink-0">
                      <CardTitle>
                        {t('tickets.title')} ({listTickets.length})
                      </CardTitle>
                      <CardDescription>
                        {listTickets.filter((t) => t.status === "open").length} {t('tickets.open')},{" "}
                        {listTickets.filter((t) => t.status === "in_progress").length} {t('tickets.in_progress')},{" "}
                        {listTickets.filter((t) => t.status === "pending").length} {t('tickets.pending')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col min-h-0">
                      <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-4">
                          {listTickets.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                {t('common.noResults')}
                              </div>
                          ) : (
                              listTickets.map((ticket) => (
                                  <div
                                      key={ticket.id}
                                      className={`p-4 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                                          selectedTicket?.id === ticket.id ? "bg-muted border-primary" : ""
                                      }`}
                                      onClick={() => loadTicketDetail(ticket.id)}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                                          {getChannelIcon(ticket.channel)}
                                          <Badge variant={getPriorityColor(ticket.priority) as any}>
                                            {t(`tickets.${ticket.priority}`)}
                                          </Badge>
                                          <Badge variant={getStatusColor(ticket.status) as any}>
                                            {t(`tickets.${ticket.status}`)}
                                          </Badge>
                                        </div>
                                        <h3 className="font-medium line-clamp-2 leading-5">{ticket.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                          <div className="flex items-center gap-1 min-w-0">
                                            <User className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{ticket.creator.name}</span>
                                          </div>
                                          {ticket.assignedTo && (
                                              <>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="truncate hidden sm:inline">{ticket.assignedTo.name}</span>
                                              </>
                                          )}
                                          <span className="hidden sm:inline">•</span>
                                          <div className="flex items-center gap-1 flex-shrink-0">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-xs">{formatRelativeTime(ticket.updatedAt)}</span>
                                          </div>
                                          {ticket.startDate && (
                                              <>
                                                <span className="hidden sm:inline">•</span>
                                                <div className="flex items-center gap-1 flex-shrink-0 hidden sm:flex">
                                                  <Calendar className="h-3 w-3" />
                                                  <span className="text-xs">Inicio: {formatDate(ticket.startDate)}</span>
                                                </div>
                                              </>
                                          )}
                                          <span className="hidden md:inline">•</span>
                                          <span className="flex items-center gap-1 text-xs flex-shrink-0 hidden md:flex">
                                      <Calendar className="h-3 w-3" />
                                            {ticket.category || 'General'}
                                    </span>
                                        </div>
                                      </div>
                                      {ticket.priority === "urgent" && (
                                          <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                                      )}
                                    </div>
                                  </div>
                              ))
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Panel de Detalles - Ahora responsivo */}
                <div className="xl:col-span-1 flex flex-col">
                  <div className="sticky top-6 flex-1">
                    <TicketDetails ticket={selectedTicket} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Vista Kanban - Marco inferior para scroll + padding corregido */}
            <TabsContent value="kanban" className="flex-1 mt-4">
              <div className="h-full flex flex-col">
                {/* Contenedor horizontal con scroll y marco inferior visible */}
                <div className="flex-1 overflow-hidden border border-border rounded-lg">
                  <div className="h-full overflow-x-auto overflow-y-hidden">
                    <div className="flex gap-6 h-full min-w-max p-4 pb-6">
                      {["open", "in_progress", "pending", "resolved"].map((status) => {
                        const statusTickets = kanbanTickets.filter(ticket => ticket.status === status)

                        return (
                            <div key={status} className="flex-shrink-0 w-80 flex flex-col">
                              <Card className="h-full flex flex-col shadow-sm border-muted">
                                <CardHeader className="flex-shrink-0 pb-3 px-4 pt-4">
                                  <CardTitle className="text-base capitalize flex items-center justify-between">
                                    <span>{t(`tickets.${status}`)}</span>
                                    <Badge variant="outline" className="ml-2">
                                      {statusTickets.length}
                                    </Badge>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col min-h-0 pt-0 px-4 pb-4">
                                  {statusTickets.length === 0 ? (
                                      <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                          <div className="text-4xl mb-2">📋</div>
                                          <p className="text-sm">Sin tickets</p>
                                        </div>
                                      </div>
                                  ) : (
                                      <ScrollArea className="flex-1">
                                        <div className="space-y-3 pr-1">
                                          {statusTickets.map((ticket) => (
                                              <div
                                                  key={ticket.id}
                                                  className={`p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-200 ${
                                                      selectedTicket?.id === ticket.id ? "bg-muted border-primary shadow-sm" : ""
                                                  }`}
                                                  onClick={() => loadTicketDetail(ticket.id)}
                                              >
                                                <div className="space-y-3">
                                                  {/* Header con ID y canal */}
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                              <span className="font-mono text-xs text-muted-foreground">
                                                {ticket.id}
                                              </span>
                                                      {getChannelIcon(ticket.channel)}
                                                    </div>
                                                    <Badge
                                                        variant={getPriorityColor(ticket.priority) as any}
                                                        className="text-xs px-2 py-0"
                                                    >
                                                      {t(`tickets.${ticket.priority}`)}
                                                    </Badge>
                                                  </div>

                                                  {/* Título del ticket */}
                                                  <h4 className="text-sm font-medium line-clamp-2 leading-snug">
                                                    {ticket.title}
                                                  </h4>

                                                  {/* Info del creador y fechas - Layout mejorado */}
                                                  <div className="space-y-2">
                                                    {/* Creador */}
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                      <User className="h-3 w-3 flex-shrink-0" />
                                                      <span className="truncate">{ticket.creator.name}</span>
                                                    </div>

                                                    {/* Fechas en líneas separadas */}
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                      <Clock className="h-3 w-3 flex-shrink-0" />
                                                      <span>{formatRelativeTime(ticket.updatedAt)}</span>
                                                    </div>

                                                    {ticket.startDate && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                          <Calendar className="h-3 w-3 flex-shrink-0" />
                                                          <span>Inicio: {formatDate(ticket.startDate)}</span>
                                                        </div>
                                                    )}
                                                  </div>

                                                  {/* Asignado (si existe) */}
                                                  {ticket.assignedTo && (
                                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <span>👤</span>
                                                        <span className="truncate">{ticket.assignedTo.name}</span>
                                                      </div>
                                                  )}

                                                  {/* Indicador de urgencia */}
                                                  {ticket.priority === "urgent" && (
                                                      <div className="flex items-center gap-1 text-xs text-red-600">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        <span className="font-medium">Urgente</span>
                                                      </div>
                                                  )}
                                                </div>
                                              </div>
                                          ))}
                                        </div>
                                      </ScrollArea>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Vista de Detalles */}
            <TabsContent value="details" className="flex-1 mt-4">
              <div className="h-full">
                <TicketDetails ticket={selectedTicket} expanded />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogo para nuevo ticket */}
        <NewTicketDialog open={showNewTicket} onOpenChange={setShowNewTicket} />
      </div>
  )
}
