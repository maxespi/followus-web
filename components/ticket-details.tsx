// components/ticket-details.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Clock,
  User,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Share,
  Globe,
  Plus,
  Send
} from 'lucide-react'
import { Ticket } from '@/lib/tasks.service'
import { formatDate } from '@/lib/date-utils'

interface TicketDetailsProps {
  ticket: Ticket | null
  expanded?: boolean
}

export function TicketDetails({ ticket, expanded = false }: TicketDetailsProps) {
  const { t } = useTranslation()
  const [newMessage, setNewMessage] = useState('')

  if (!ticket) {
    return (
        <Card className="h-fit">
          <CardContent className="flex items-center justify-center h-32 sm:h-48">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
              <p className="text-xs sm:text-sm">Selecciona un ticket para ver los detalles</p>
            </div>
          </CardContent>
        </Card>
    )
  }

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


  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      // TODO: Implementar envío real de mensaje
      setNewMessage('')
    }
  }

  return (
      <div className={`space-y-4 ${expanded ? 'max-w-4xl mx-auto' : ''}`}>
        {/* Header del Ticket */}
        <Card>
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs sm:text-sm text-muted-foreground">{ticket.id}</span>
                {getChannelIcon(ticket.channel)}
                <Badge variant={getPriorityColor(ticket.priority) as any} className="text-xs">
                  {t(`tickets.${ticket.priority}`)}
                </Badge>
                <Badge variant={getStatusColor(ticket.status) as any} className="text-xs">
                  {t(`tickets.${ticket.status}`)}
                </Badge>
              </div>
              <div>
                <CardTitle className={`${expanded ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'} leading-tight`}>
                  {ticket.title}
                </CardTitle>
                {expanded && (
                    <CardDescription className="mt-2 text-sm">
                      {ticket.description}
                    </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>

          {expanded && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Información del Cliente */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      Cliente
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {ticket.creator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{ticket.creator.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{ticket.creator.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información de Asignación */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Asignado a</h4>
                    {ticket.assignedTo ? (
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {ticket.assignedTo.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{ticket.assignedTo.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{ticket.assignedTo.role || 'Agente'}</p>
                          </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">Sin asignar</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Metadatos */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Creado</p>
                    <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Categoría</p>
                    <p className="font-medium">{ticket.category || 'General'}</p>
                  </div>
                </div>

                {/* Tags */}
                {ticket.tags && ticket.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {ticket.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs py-0">
                              {tag}
                            </Badge>
                        ))}
                        {ticket.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0">
                              +{ticket.tags.length - 3}
                            </Badge>
                        )}
                      </div>
                    </div>
                )}
              </CardContent>
          )}
        </Card>

        {/* Conversación - Compacta para sidebar, expandida para view completa */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <MessageSquare className="h-4 w-4" />
              Conversación ({ticket.messages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ticket.messages.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No hay mensajes</p>
                </div>
            ) : (
                <ScrollArea className={expanded ? "h-[400px]" : "h-[200px]"}>
                  <div className="space-y-3 pr-3">
                    {ticket.messages.map((message) => (
                        <div key={message.id} className="flex space-x-2">
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className="text-xs">
                              {message.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-xs truncate">{message.author.name}</p>
                              <Badge variant="outline" className="text-xs py-0">
                                {message.isInternal ? 'Interno' : 'Cliente'}
                              </Badge>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-2">
                              <p className="text-xs leading-relaxed break-words">{message.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(message.createdAt)}
                            </p>
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {message.reactions.map((reaction) => (
                                  <span key={reaction.id} className="text-xs bg-muted rounded px-1">
                                    {reaction.type}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
                </ScrollArea>
            )}

            {/* Nueva respuesta - Solo en vista expandida */}
            {expanded && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <Textarea
                        placeholder="Escribe tu respuesta..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[80px] text-sm"
                    />
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Adjuntar
                      </Button>
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="sm">
                        <Send className="mr-2 h-4 w-4" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </>
            )}
          </CardContent>
        </Card>

        {/* Acciones - Solo para vista compacta del sidebar */}
        {!expanded && (
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Asignar
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Resolver
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}

        {/* Acciones expandidas */}
        {expanded && (
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    {t('tickets.assign')}
                  </Button>
                  <Button variant="outline">
                    {t('tickets.escalate')}
                  </Button>
                  <Button variant="outline">
                    {t('tickets.resolve')}
                  </Button>
                  <Button variant="outline">
                    {t('tickets.close')}
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
  )
}
