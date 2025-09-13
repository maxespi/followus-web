// components/ticket-management.tsx
'use client'

import { useState, useMemo } from 'react'
import { useTranslation } from '@/context/AppContext'
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
import { mockTickets, mockUsers } from '@/lib/mock-data'
import { Ticket, TicketFilters } from '@/lib/types'
import { TicketDetails } from '@/components/ticket-details'
import { NewTicketDialog } from '@/components/new-ticket-dialog'

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

export function TicketManagement() {
  const { t } = useTranslation()

  // Estados locales
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(mockTickets[0])
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [activeTab, setActiveTab] = useState('list')

  // Estados de filtros
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: [],
    priority: [],
    channel: [],
    assignee: []
  })

  // Tickets filtrados
  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      // Filtro de búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
            ticket.id.toLowerCase().includes(searchLower) ||
            ticket.title.toLowerCase().includes(searchLower) ||
            ticket.customer.name.toLowerCase().includes(searchLower) ||
            ticket.customer.email.toLowerCase().includes(searchLower)

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
      if (filters.assignee && filters.assignee.length > 0 && ticket.assignee && !filters.assignee.includes(ticket.assignee.id)) {
        return false
      }

      return true
    })
  }, [filters])

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

  // Formatear tiempo relativo
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Hace menos de 1h'
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays === 1) return 'Ayer'
    return `Hace ${diffDays} días`
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('tickets.title')}</h1>
            <p className="text-muted-foreground">
              {t('tickets.subtitle')}
            </p>
          </div>
          <Button onClick={() => setShowNewTicket(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('tickets.newTicket')}
          </Button>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
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
                  <SelectItem value="in-progress">{t('tickets.in-progress')}</SelectItem>
                  <SelectItem value="waiting">{t('tickets.waiting')}</SelectItem>
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

        {/* Tabs de Vista */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">{t('tickets.listView')}</TabsTrigger>
            <TabsTrigger value="kanban">{t('tickets.kanbanBoard')}</TabsTrigger>
            <TabsTrigger value="details">{t('tickets.ticketDetails')}</TabsTrigger>
          </TabsList>

          {/* Vista de Lista */}
          <TabsContent value="list" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Lista de Tickets - Ocupa más espacio en pantallas grandes */}
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('tickets.title')} ({filteredTickets.length})
                    </CardTitle>
                    <CardDescription>
                      {filteredTickets.filter((t) => t.status === "open").length} {t('tickets.open')},{" "}
                      {filteredTickets.filter((t) => t.status === "in-progress").length} {t('tickets.in-progress')},{" "}
                      {filteredTickets.filter((t) => t.status === "resolved").length} {t('tickets.resolved')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {filteredTickets.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              {t('common.noResults')}
                            </div>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className={`p-4 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                                        selectedTicket?.id === ticket.id ? "bg-muted border-primary" : ""
                                    }`}
                                    onClick={() => setSelectedTicket(ticket)}
                                >
                                  <div className="flex items-start justify-between">
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
                                      <h3 className="font-medium truncate pr-2">{ticket.title}</h3>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                        <div className="flex items-center gap-1 min-w-0">
                                          <User className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">{ticket.customer.name}</span>
                                        </div>
                                        {ticket.assignee && (
                                            <>
                                              <span className="hidden sm:inline">•</span>
                                              <span className="truncate hidden sm:inline">{ticket.assignee.name}</span>
                                            </>
                                        )}
                                        <span className="hidden sm:inline">•</span>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          <Clock className="h-3 w-3" />
                                          <span className="text-xs">{formatRelativeTime(ticket.updatedAt)}</span>
                                        </div>
                                        <span className="hidden md:inline">•</span>
                                        <span className="flex items-center gap-1 text-xs flex-shrink-0 hidden md:flex">
                                    <Calendar className="h-3 w-3" />
                                          {ticket.sla}
                                  </span>
                                      </div>
                                    </div>
                                    {ticket.priority === "urgent" && (
                                        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 ml-2" />
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
              <div className="xl:col-span-1">
                <div className="sticky top-6">
                  <TicketDetails ticket={selectedTicket} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Vista Kanban */}
          <TabsContent value="kanban">
            <ScrollArea className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 min-w-max">
                {["open", "in-progress", "waiting", "resolved", "closed"].map((status) => (
                    <Card key={status} className="min-w-[280px]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base capitalize">
                          {t(`tickets.${status}`)}
                        </CardTitle>
                        <CardDescription>
                          {filteredTickets.filter((t) => t.status === status).length} tickets
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-3">
                            {filteredTickets
                                .filter((ticket) => ticket.status === status)
                                .map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                                          {getChannelIcon(ticket.channel)}
                                          <Badge variant={getPriorityColor(ticket.priority) as any} className="text-xs">
                                            {t(`tickets.${ticket.priority}`)}
                                          </Badge>
                                        </div>
                                        <h4 className="text-sm font-medium line-clamp-2">{ticket.title}</h4>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                          <span className="truncate flex-1">{ticket.customer.name}</span>
                                          <span className="flex-shrink-0 ml-2">{formatRelativeTime(ticket.updatedAt)}</span>
                                        </div>
                                      </div>
                                    </div>
                                ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Vista de Detalles */}
          <TabsContent value="details">
            <TicketDetails ticket={selectedTicket} expanded />
          </TabsContent>
        </Tabs>

        {/* Dialogo para nuevo ticket */}
        <NewTicketDialog open={showNewTicket} onOpenChange={setShowNewTicket} />
      </div>
  )
}
