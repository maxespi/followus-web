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
  Send,
  MoreHorizontal
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
  const [showCommentInput, setShowCommentInput] = useState(false)

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información del Cliente - Mejorada */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2 text-sm border-b pb-2">
                      <User className="h-4 w-4" />
                      Información del Cliente
                    </h4>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm font-medium">
                            {ticket.creator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{ticket.creator.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{ticket.creator.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">ID: {ticket.creator.id}</Badge>
                            <Badge variant="outline" className="text-xs">Creador</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Asignación - Mejorada */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm border-b pb-2">Responsable Asignado</h4>
                    {ticket.assignedTo ? (
                        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="text-sm font-medium">
                                {ticket.assignedTo.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{ticket.assignedTo.name}</p>
                              <p className="text-sm text-muted-foreground">{ticket.assignedTo.role || 'Agente de Soporte'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="default" className="text-xs">Responsable</Badge>
                                <Badge variant="outline" className="text-xs">ID: {ticket.assignedTo.id}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                    ) : (
                        <div className="bg-muted/20 p-3 rounded-lg border border-dashed">
                          <p className="text-muted-foreground text-sm text-center">Sin asignar</p>
                          <p className="text-xs text-muted-foreground text-center mt-1">Este ticket necesita ser asignado a un agente</p>
                        </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Metadatos Expandidos */}
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

                {/* Tags y Etiquetas - Mejoradas */}
                {ticket.tags && ticket.tags.length > 0 && (
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <p className="text-sm font-medium">Etiquetas del Ticket</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ticket.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                              #{tag}
                            </Badge>
                        ))}
                      </div>
                    </div>
                )}
              </CardContent>
          )}
        </Card>

        {/* Conversación - Con input reposicionado y botón Más */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversación ({ticket.messages.length})
              </div>
              {!expanded && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommentInput(!showCommentInput)}
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Input de comentarios - Mostrado al inicio cuando corresponde */}
            {(expanded || showCommentInput) && (
              <div className="space-y-3 mb-4">
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
                <Separator />
              </div>
            )}

            {ticket.messages.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No hay mensajes</p>
                </div>
            ) : (
                <ScrollArea className={expanded ? "h-[400px]" : "h-[200px]"}>
                  <div className="space-y-3 pr-3">
                    {/* Mensajes ordenados por fecha descendente (más reciente primero) */}
                    {ticket.messages
                      .slice()
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((message) => (
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
          </CardContent>
        </Card>

        {/* Acciones - Solo para vista compacta del sidebar */}
        {!expanded && (
            <Card>
              <CardContent className="pt-4 space-y-3">
                {/* Participantes */}
                {ticket.participants && ticket.participants.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Participantes ({ticket.participants.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {ticket.participants.slice(0, 3).map((participant) => (
                        <div key={participant.id} className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs text-muted-foreground">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs truncate max-w-16">{participant.name.split(' ')[0]}</span>
                          {participant.role && (
                            <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                              {participant.role}
                            </Badge>
                          )}
                        </div>
                      ))}
                      {ticket.participants.length > 3 && (
                        <div className="flex items-center justify-center bg-muted/50 rounded px-2 py-1">
                          <span className="text-xs text-muted-foreground">+{ticket.participants.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                <CardTitle className="flex items-center justify-between">
                  <span>Acciones</span>
                  {ticket.participants && ticket.participants.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {ticket.participants.length} participante{ticket.participants.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Participantes expandidos */}
                {ticket.participants && ticket.participants.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <User className="h-4 w-4" />
                      Participantes del Ticket
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ticket.participants.map((participant) => (
                        <div key={participant.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{participant.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {participant.role && (
                                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                                  {participant.role}
                                </Badge>
                              )}
                              {participant.hasPrivileges && (
                                <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

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
