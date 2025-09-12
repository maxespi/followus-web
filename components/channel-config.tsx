import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, RefreshCw, TestTube } from "lucide-react"

interface Channel {
  id: string
  name: string
  status: string
  config: Record<string, any>
}

interface ChannelConfigProps {
  channel: Channel
}

export function ChannelConfig({ channel }: ChannelConfigProps) {
  const renderWhatsAppConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Business Phone Number</Label>
          <Input id="phone" value={channel.config.phoneNumber} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">Business Name</Label>
          <Input id="business" value={channel.config.businessName} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="webhook">Webhook URL</Label>
        <div className="flex gap-2">
          <Input id="webhook" value={channel.config.webhookUrl} readOnly />
          <Button variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apikey">API Key</Label>
        <div className="flex gap-2">
          <Input id="apikey" type="password" value={channel.config.apiKey} readOnly />
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium">Message Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-reply">Auto-reply for new messages</Label>
            <Switch id="auto-reply" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="read-receipts">Send read receipts</Label>
            <Switch id="read-receipts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="typing-indicator">Show typing indicator</Label>
            <Switch id="typing-indicator" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmailConfig = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Support Email Address</Label>
        <Input id="email" value={channel.config.emailAddress} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="smtp">SMTP Server</Label>
          <Input id="smtp" value={channel.config.smtpServer} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imap">IMAP Server</Label>
          <Input id="imap" value={channel.config.imapServer} />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium">Email Templates</h4>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="auto-reply-template">Auto-reply Template</Label>
            <Textarea
              id="auto-reply-template"
              placeholder="Thank you for contacting us. We have received your message and will respond within 24 hours."
              className="min-h-20"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-reply-enabled">Enable auto-reply</Label>
            <Switch id="auto-reply-enabled" checked={channel.config.autoReply} />
          </div>
        </div>
      </div>
    </div>
  )

  const renderWebChatConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="widget-id">Widget ID</Label>
          <div className="flex gap-2">
            <Input id="widget-id" value={channel.config.widgetId} readOnly />
            <Button variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website URL</Label>
          <Input id="website" value={channel.config.websiteUrl} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={channel.config.theme}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Position</Label>
          <Select value={channel.config.position}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium">Widget Behavior</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="proactive">Proactive messages</Label>
            <Switch id="proactive" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="offline">Show when offline</Label>
            <Switch id="offline" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sound">Sound notifications</Label>
            <Switch id="sound" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="embed-code">Embed Code</Label>
        <Textarea
          id="embed-code"
          value={`<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://widget.followus.com/'+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${channel.config.widgetId}');
</script>`}
          readOnly
          className="min-h-24 font-mono text-xs"
        />
      </div>
    </div>
  )

  const renderConfig = () => {
    switch (channel.id) {
      case "whatsapp":
        return renderWhatsAppConfig()
      case "email":
        return renderEmailConfig()
      case "webchat":
        return renderWebChatConfig()
      default:
        return <div>Configuration not available</div>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{channel.name} Configuration</CardTitle>
            <CardDescription>Configure settings and integration parameters for {channel.name}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{channel.status}</Badge>
            <Button variant="outline" size="sm">
              <TestTube className="mr-2 h-4 w-4" />
              Test Connection
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderConfig()}

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  )
}
