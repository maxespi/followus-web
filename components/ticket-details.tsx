import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Mail, Phone, Clock, User, Tag, AlertTriangle, Send, Paperclip } from "lucide-react"

interface Ticket {
  id: string
  title: string
  customer: string
  email: string
  channel: string
  priority: string
  status: string
  category: string
  assignee: string
  created: string
  updated: string
  sla: string
  description: string
}

interface TicketDetailsProps {
  ticket: Ticket
  expanded?: boolean
}

export function TicketDetails({ ticket, expanded = false }: TicketDetailsProps) {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "webchat":
        return <Phone className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in-progress":
        return "secondary"
      case "resolved":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-balance">{ticket.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span className="font-mono">{ticket.id}</span>
              {getChannelIcon(ticket.channel)}
              <span className="capitalize">{ticket.channel}</span>
            </CardDescription>
          </div>
          {ticket.priority === "high" && <AlertTriangle className="h-5 w-5 text-destructive" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status and Priority */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusColor(ticket.status) as any}>{ticket.status}</Badge>
          <Badge variant={getPriorityColor(ticket.priority) as any}>{ticket.priority} priority</Badge>
          <Badge variant="outline">
            <Tag className="mr-1 h-3 w-3" />
            {ticket.category}
          </Badge>
        </div>

        {/* Customer Info */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer Information
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{ticket.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{ticket.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assignee:</span>
              <span>{ticket.assignee}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline & SLA
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(ticket.created).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span>{new Date(ticket.updated).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SLA Status:</span>
              <span className={ticket.sla.includes("remaining") ? "text-orange-600" : "text-green-600"}>
                {ticket.sla}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-3">
          <h4 className="font-medium">Description</h4>
          <p className="text-sm text-muted-foreground text-pretty">{ticket.description}</p>
        </div>

        {expanded && (
          <>
            <Separator />

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Change Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Response */}
            <div className="space-y-3">
              <h4 className="font-medium">Add Response</h4>
              <Textarea placeholder="Type your response to the customer..." className="min-h-24" />
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach File
                </Button>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  Send Response
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
