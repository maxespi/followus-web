// components/ticket-blocks/tags-block.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticket } from '@/lib/tasks.service'

interface TagsBlockProps {
  ticket: Ticket
  expanded?: boolean
}

export function TagsBlock({ ticket, expanded = false }: TagsBlockProps) {
  if (!ticket.tags || ticket.tags.length === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Etiquetas del Ticket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {ticket.tags.map((tag, tagIndex) => (
            <Badge key={`tag-${tag}-${tagIndex}`} variant="secondary" className="text-xs px-2 py-1">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}