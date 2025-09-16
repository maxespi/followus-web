// components/ticket-blocks/client-info-block.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User } from 'lucide-react'
import { Ticket } from '@/lib/tasks.service'

interface ClientInfoBlockProps {
  ticket: Ticket
  expanded?: boolean
}

export function ClientInfoBlock({ ticket, expanded = false }: ClientInfoBlockProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 border-b pb-2">
          <User className="h-4 w-4" />
          Información del Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}