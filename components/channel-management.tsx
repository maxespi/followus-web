"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { ChannelConfig } from "@/components/channel-config"
import { WebChatWidget } from "@/components/webchat-widget"
import {
  MessageSquare,
  Mail,
  Phone,
  Settings,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
} from "lucide-react"

const channelData = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: MessageSquare,
    status: "connected",
    enabled: true,
    messages: 1247,
    responseTime: "2.3 min",
    satisfaction: 94,
    description: "WhatsApp Business API integration for customer messaging",
    config: {
      phoneNumber: "+1 (555) 123-4567",
      businessName: "FollowUS Support",
      webhookUrl: "https://api.followus.com/webhook/whatsapp",
      apiKey: "wa_live_••••••••••••••••",
    },
  },
  {
    id: "email",
    name: "Email Support",
    icon: Mail,
    status: "connected",
    enabled: true,
    messages: 892,
    responseTime: "1.8 hours",
    satisfaction: 91,
    description: "Email integration for support@followus.com",
    config: {
      emailAddress: "support@followus.com",
      smtpServer: "smtp.followus.com",
      imapServer: "imap.followus.com",
      autoReply: true,
    },
  },
  {
    id: "webchat",
    name: "Web Chat",
    icon: Phone,
    status: "connected",
    enabled: true,
    messages: 634,
    responseTime: "45 sec",
    satisfaction: 96,
    description: "Live chat widget for website integration",
    config: {
      widgetId: "wc_••••••••••••••••",
      websiteUrl: "https://followus.com",
      theme: "light",
      position: "bottom-right",
    },
  },
]

export function ChannelManagement() {
  const [channels, setChannels] = useState(channelData)
  const [selectedChannel, setSelectedChannel] = useState(channelData[0])

  const toggleChannel = (channelId: string) => {
    setChannels(
      channels.map((channel) => (channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel)),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "default"
      case "disconnected":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Channel Management</h1>
          <p className="text-muted-foreground text-pretty">
            Configure and monitor your multi-channel customer communication
          </p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Global Settings
        </Button>
      </div>

      {/* Channel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.map((channel) => {
          const Icon = channel.icon
          return (
            <Card key={channel.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(channel.status)}
                    <Switch checked={channel.enabled} onCheckedChange={() => toggleChannel(channel.id)} />
                  </div>
                </div>
                <CardDescription>{channel.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusColor(channel.status) as any}>{channel.status}</Badge>
                  <span className="text-sm text-muted-foreground">{channel.enabled ? "Active" : "Disabled"}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Messages Today</span>
                    <span className="font-medium">{channel.messages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Response</span>
                    <span className="font-medium">{channel.responseTime}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Satisfaction</span>
                      <span className="font-medium">{channel.satisfaction}%</span>
                    </div>
                    <Progress value={channel.satisfaction} className="h-2" />
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedChannel(channel)}>
                  Configure
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Channel Details */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="widget">Widget Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Activity
                </CardTitle>
                <CardDescription>Live channel performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {channels.map((channel) => {
                  const Icon = channel.icon
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{channel.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 10) + 1} active conversations
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          <TrendingUp className="inline h-3 w-3 mr-1" />+{Math.floor(Math.random() * 20) + 5}%
                        </p>
                        <p className="text-xs text-muted-foreground">vs yesterday</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Health Status</CardTitle>
                <CardDescription>System status and connectivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WhatsApp API</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Server</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Web Chat Widget</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webhook Delivery</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Delayed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration">
          <ChannelConfig channel={selectedChannel} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,773</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.8 min</div>
                <p className="text-xs text-muted-foreground">-15% improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+3% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">+1% from last week</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Channel Performance Comparison</CardTitle>
              <CardDescription>Message volume and response times by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel) => {
                  const Icon = channel.icon
                  const volume = (channel.messages / Math.max(...channels.map((c) => c.messages))) * 100
                  return (
                    <div key={channel.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {channel.messages} messages • {channel.responseTime} avg
                        </div>
                      </div>
                      <Progress value={volume} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widget">
          <WebChatWidget />
        </TabsContent>
      </Tabs>
    </div>
  )
}
