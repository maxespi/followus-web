"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TicketDetails } from "@/components/ticket-details"
import { NewTicketDialog } from "@/components/new-ticket-dialog"
import { Search, Filter, Plus, MessageSquare, Mail, Phone, Clock, AlertTriangle } from "lucide-react"

const mockTickets = [
  {
    id: "TK-001",
    title: "Payment issue - Order #1234",
    customer: "María González",
    email: "maria@email.com",
    channel: "whatsapp",
    priority: "high",
    status: "open",
    category: "billing",
    assignee: "Carlos Agent",
    created: "2024-01-15T10:30:00Z",
    updated: "2024-01-15T14:20:00Z",
    sla: "2h remaining",
    description: "Customer reports payment was charged but order shows as unpaid in system.",
  },
  {
    id: "TK-002",
    title: "Product warranty inquiry",
    customer: "Carlos Ruiz",
    email: "carlos@email.com",
    channel: "email",
    priority: "medium",
    status: "in-progress",
    category: "warranty",
    assignee: "Ana Support",
    created: "2024-01-15T09:15:00Z",
    updated: "2024-01-15T13:45:00Z",
    sla: "4h remaining",
    description: "Customer asking about warranty coverage for product purchased 6 months ago.",
  },
  {
    id: "TK-003",
    title: "Shipping status update",
    customer: "Ana López",
    email: "ana@email.com",
    channel: "webchat",
    priority: "low",
    status: "resolved",
    category: "shipping",
    assignee: "Luis Agent",
    created: "2024-01-14T16:20:00Z",
    updated: "2024-01-15T08:30:00Z",
    sla: "Completed",
    description: "Customer requesting tracking information for recent order.",
  },
]

export function TicketManagement() {
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showNewTicket, setShowNewTicket] = useState(false)

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

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesChannel = channelFilter === "all" || ticket.channel === channelFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesChannel && matchesPriority
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Ticket Management</h1>
          <p className="text-muted-foreground text-pretty">
            Manage and track customer support tickets across all channels
          </p>
        </div>
        <Button onClick={() => setShowNewTicket(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tickets, customers, or IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="webchat">Web Chat</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="details">Ticket Details</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
                  <CardDescription>
                    {filteredTickets.filter((t) => t.status === "open").length} open,{" "}
                    {filteredTickets.filter((t) => t.status === "in-progress").length} in progress,{" "}
                    {filteredTickets.filter((t) => t.status === "resolved").length} resolved
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-4 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedTicket?.id === ticket.id ? "bg-muted border-primary" : ""
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                            {getChannelIcon(ticket.channel)}
                            <Badge variant={getPriorityColor(ticket.priority) as any}>{ticket.priority}</Badge>
                            <Badge variant={getStatusColor(ticket.status) as any}>{ticket.status}</Badge>
                          </div>
                          <h3 className="font-medium text-balance">{ticket.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{ticket.customer}</span>
                            <span>•</span>
                            <span>{ticket.assignee}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ticket.sla}
                            </span>
                          </div>
                        </div>
                        {ticket.priority === "high" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <TicketDetails ticket={selectedTicket} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["open", "in-progress", "resolved"].map((status) => (
              <Card key={status}>
                <CardHeader>
                  <CardTitle className="capitalize">{status.replace("-", " ")}</CardTitle>
                  <CardDescription>{filteredTickets.filter((t) => t.status === status).length} tickets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredTickets
                    .filter((ticket) => ticket.status === status)
                    .map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                            {getChannelIcon(ticket.channel)}
                            <Badge variant={getPriorityColor(ticket.priority) as any} className="text-xs">
                              {ticket.priority}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium text-balance">{ticket.title}</h4>
                          <p className="text-xs text-muted-foreground">{ticket.customer}</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details">
          <TicketDetails ticket={selectedTicket} expanded />
        </TabsContent>
      </Tabs>

      <NewTicketDialog open={showNewTicket} onOpenChange={setShowNewTicket} />
    </div>
  )
}
