// components/ticket-blocks/header-block.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MessageSquare, Share, Globe } from 'lucide-react'
import { Ticket } from '@/lib/tasks.service'
import { useTranslation } from '@/context/AppContext'

interface HeaderBlockProps {
  ticket: Ticket
  expanded?: boolean
}

export function HeaderBlock({ ticket, expanded = false }: HeaderBlockProps) {
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
            {expanded && ticket.description && (
              <CardDescription className="mt-2 text-sm">
                {ticket.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}