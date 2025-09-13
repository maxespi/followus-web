// components/channel-management.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Settings,
  BarChart3,
  Mail,
  MessageSquare,
  Phone,
  Share,
  Globe,
  Clock,
  Star
} from 'lucide-react'
import { mockChannels } from '@/lib/mock-data'

export function ChannelManagement() {
  const { t } = useTranslation()
  const [channels] = useState(mockChannels)

  const getChannelIcon = (type: string) => {
    const iconMap = {
      email: <Mail className="h-5 w-5" />,
      chat: <MessageSquare className="h-5 w-5" />,
      phone: <Phone className="h-5 w-5" />,
      social: <Share className="h-5 w-5" />,
      web: <Globe className="h-5 w-5" />
    }
    return iconMap[type as keyof typeof iconMap] || <Mail className="h-5 w-5" />
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('channels.title')}</h1>
            <p className="text-muted-foreground">
              {t('channels.subtitle')}
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('channels.newChannel')}
          </Button>
        </div>

        {/* Resumen de Canales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((channel) => (
              <Card key={channel.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    {getChannelIcon(channel.type)}
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                  </div>
                  <Badge variant={channel.status === 'active' ? 'default' : 'secondary'}>
                    {t(`channels.${channel.status}`)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Tickets</p>
                      <p className="text-2xl font-bold">{channel.stats.totalTickets}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conversaciones</p>
                      <p className="text-2xl font-bold">{channel.stats.activeConversations}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tiempo de Respuesta</span>
                      <span>{channel.stats.avgResponseTime}h</span>
                    </div>
                    <Progress value={(5 - channel.stats.avgResponseTime) * 20} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{channel.stats.satisfactionScore}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Configuración Detallada */}
        <Tabs defaultValue="configuration" className="space-y-4">
          <TabsList>
            <TabsTrigger value="configuration">{t('channels.configuration')}</TabsTrigger>
            <TabsTrigger value="statistics">{t('channels.statistics')}</TabsTrigger>
          </TabsList>

          <TabsContent value="configuration" className="space-y-4">
            {channels.map((channel) => (
                <Card key={channel.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getChannelIcon(channel.type)}
                        <CardTitle>{channel.name}</CardTitle>
                      </div>
                      <Switch checked={channel.status === 'active'} />
                    </div>
                    <CardDescription>
                      Configuración y reglas para el canal {channel.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{t('channels.autoAssign')}</span>
                          <Switch checked={channel.settings.autoAssign} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{t('channels.autoResponse')}</span>
                          <Switch checked={channel.settings.autoResponse} />
                        </div>
                        <div>
                          <span className="text-sm font-medium">Prioridad por Defecto</span>
                          <Badge variant="outline" className="ml-2">
                            {t(`tickets.${channel.settings.defaultPriority}`)}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">{t('channels.businessHours')}</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Zona Horaria: {channel.settings.businessHours.timezone}</p>
                            <p>Lun - Vie: 09:00 - 18:00</p>
                            <p>Fin de semana: Cerrado</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Canal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {channels.map((channel) => (
                      <div key={channel.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(channel.type)}
                            <span className="font-medium">{channel.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                        {channel.stats.totalTickets} tickets
                      </span>
                        </div>
                        <Progress
                            value={(channel.stats.totalTickets / Math.max(...channels.map(c => c.stats.totalTickets))) * 100}
                        />
                      </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Satisfacción del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {channels.map((channel) => (
                      <div key={channel.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(channel.type)}
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{channel.stats.satisfactionScore}</span>
                        </div>
                      </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
