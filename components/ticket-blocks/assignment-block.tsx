// components/ticket-blocks/assignment-block.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User } from 'lucide-react'
import { Ticket } from '@/lib/tasks.service'

interface AssignmentBlockProps {
  ticket: Ticket
  expanded?: boolean
}

export function AssignmentBlock({ ticket, expanded = false }: AssignmentBlockProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Asignación y Participantes
          </div>
          {ticket.participants && ticket.participants.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {ticket.participants.length} participante{ticket.participants.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Responsable Asignado */}
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

        {/* Participantes */}
        {ticket.participants && ticket.participants.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Todos los Participantes
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ticket.participants.map((participant, index) => (
                  <div key={`participant-${participant.id}-${index}`} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
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
          </>
        )}
      </CardContent>
    </Card>
  )
}