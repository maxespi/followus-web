import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket, Clock, CheckCircle, AlertTriangle, MessageSquare, Mail, Phone, TrendingUp } from "lucide-react"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground text-pretty">
            Welcome to FollowUS - Your unified customer support portal
          </p>
        </div>
        <Button>
          <Ticket className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">-8% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">+23% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Within target range</p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Channel Activity</CardTitle>
            <CardDescription>Tickets by communication channel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">WhatsApp</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">67 tickets</span>
                <Badge variant="secondary">52%</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-chart-2" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">38 tickets</span>
                <Badge variant="secondary">30%</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-chart-3" />
                <span className="text-sm font-medium">Web Chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">22 tickets</span>
                <Badge variant="secondary">18%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Payment issue - Order #1234</p>
                <p className="text-xs text-muted-foreground">Customer: María González</p>
              </div>
              <Badge variant="destructive">High</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Product warranty inquiry</p>
                <p className="text-xs text-muted-foreground">Customer: Carlos Ruiz</p>
              </div>
              <Badge variant="secondary">Medium</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Shipping status update</p>
                <p className="text-xs text-muted-foreground">Customer: Ana López</p>
              </div>
              <Badge variant="outline">Low</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
