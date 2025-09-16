// components/ticket-blocks/conversation-block.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Plus, Send, MoreHorizontal } from 'lucide-react'
import { Ticket } from '@/lib/tasks.service'
import { formatDate } from '@/lib/date-utils'

interface ConversationBlockProps {
  ticket: Ticket
  expanded?: boolean
}

export function ConversationBlock({ ticket, expanded = false }: ConversationBlockProps) {
  const [newMessage, setNewMessage] = useState('')
  const [showCommentInput, setShowCommentInput] = useState(false)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implementar envío real de mensaje
      setNewMessage('')
    }
  }

  return (
    <Card className="w-full">
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
                .map((message, messageIndex) => (
                  <div key={`message-${message.id}-${messageIndex}`} className="flex space-x-2">
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
                          {message.reactions.map((reaction, reactionIndex) => (
                            <span key={`reaction-${reaction.id}-${reactionIndex}`} className="text-xs bg-muted rounded px-1">
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
  )
}