// components/ticket-blocks/metadata-block.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Globe, MessageSquare, Mail, Phone, Share } from 'lucide-react'
import { Ticket } from '@/lib/tasks.service'
import { formatDate } from '@/lib/date-utils'
import { useTranslation } from '@/context/AppContext'

interface MetadataBlockProps {
  ticket: Ticket
  expanded?: boolean
}

export function MetadataBlock({ ticket, expanded = false }: MetadataBlockProps) {
  const { t } = useTranslation()

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

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Metadatos y Fechas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Fechas</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creado:</span>
                <span className="font-medium">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actualizado:</span>
                <span className="font-medium">{formatDate(ticket.updatedAt)}</span>
              </div>
              {ticket.startDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Iniciado:</span>
                  <span className="font-medium">{formatDate(ticket.startDate)}</span>
                </div>
              )}
              {ticket.fecha_finalizacion && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Finalizado:</span>
                  <span className="font-medium">{formatDate(ticket.fecha_finalizacion)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Clasificación</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Categoría:</span>
                <Badge variant="outline" className="text-xs">{ticket.category || 'General'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Canal:</span>
                <div className="flex items-center gap-1">
                  {getChannelIcon(ticket.channel)}
                  <span className="text-xs capitalize">{ticket.channel}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Prioridad:</span>
                <Badge variant={getPriorityColor(ticket.priority) as any} className="text-xs">
                  {t(`tickets.${ticket.priority}`)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Actividad</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <Badge variant={getStatusColor(ticket.status) as any} className="text-xs">
                  {t(`tickets.${ticket.status}`)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mensajes:</span>
                <span className="font-medium">{ticket.messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participantes:</span>
                <span className="font-medium">{(ticket.participants?.length || 0) + 1}</span>
              </div>
              {ticket.viewedBy && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visto por:</span>
                  <span className="font-medium">{ticket.viewedBy.length} usuario(s)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}