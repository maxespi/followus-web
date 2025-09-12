import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Minimize2, X, User } from "lucide-react"

export function WebChatWidget() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Web Chat Widget Preview</CardTitle>
          <CardDescription>Preview how the chat widget will appear on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-8 rounded-lg relative min-h-96">
            {/* Simulated website background */}
            <div className="absolute inset-4 bg-background/50 rounded border-2 border-dashed border-border flex items-center justify-center">
              <p className="text-muted-foreground">Your Website Content</p>
            </div>

            {/* Chat Widget */}
            <div className="absolute bottom-6 right-6 z-10">
              {/* Widget Button */}
              <div className="mb-4">
                <Button size="lg" className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow">
                  <MessageSquare className="h-6 w-6" />
                </Button>
              </div>

              {/* Chat Window */}
              <div className="w-80 h-96 bg-card border border-border rounded-lg shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">FollowUS Support</p>
                      <p className="text-xs opacity-90">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-muted p-2 rounded-lg max-w-xs">
                      <p className="text-sm">Hello! How can I help you today?</p>
                      <p className="text-xs text-muted-foreground mt-1">Just now</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg max-w-xs">
                      <p className="text-sm">Hi, I have a question about my order</p>
                      <p className="text-xs opacity-70 mt-1">Just now</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-muted p-2 rounded-lg max-w-xs">
                      <p className="text-sm">I'd be happy to help! Can you provide your order number?</p>
                      <p className="text-xs text-muted-foreground mt-1">Just now</p>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Widget Statistics</CardTitle>
            <CardDescription>Real-time widget performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Sessions</span>
              <Badge variant="secondary">23</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Messages Today</span>
              <span className="font-medium">634</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg Response Time</span>
              <span className="font-medium">45 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <span className="font-medium text-green-600">12.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>Widget deployment and health status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Widget Loaded</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">WebSocket Connection</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Agent Availability</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">5 agents online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Updated</span>
              <span className="text-sm text-muted-foreground">2 minutes ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
