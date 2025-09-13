// components/dashboard-overview.tsx
'use client'

import { useState, useMemo } from 'react'
import { useTranslation } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Star,
  Activity,
  RefreshCw
} from 'lucide-react'
import { mockDashboardMetrics, mockTickets, mockUsers } from '@/lib/mock-data'

// Componente de métrica individual
interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  icon: React.ReactNode
  className?: string
}

function MetricCard({ title, value, description, trend, trendValue, icon, className }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {(description || trend) && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                {trend && (
                    <>
                      {getTrendIcon()}
                      <span className={getTrendColor()}>{trendValue}</span>
                    </>
                )}
                {description && <span>{description}</span>}
              </div>
          )}
        </CardContent>
      </Card>
  )
}

// Componente de gráfico simple (mock)
function SimpleChart({ data, title, type = 'bar' }: { data: Record<string, number>, title: string, type?: 'bar' | 'pie' }) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0)

  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(data).map(([key, value]) => {
            const percentage = total > 0 ? (value / total) * 100 : 0

            return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace('-', ' ')}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
            )
          })}
        </CardContent>
      </Card>
  )
}

export function DashboardOverview() {
  const { t } = useTranslation()
  const [refreshing, setRefreshing] = useState(false)

  // Calcular métricas en tiempo real basado en los datos mock
  const metrics = useMemo(() => {
    const openTickets = mockTickets.filter(t => t.status === 'open').length
    const inProgressTickets = mockTickets.filter(t => t.status === 'in-progress').length
    const resolvedToday = mockTickets.filter(t => {
      const today = new Date()
      const ticketDate = new Date(t.updatedAt)
      return t.status === 'resolved' &&
          ticketDate.toDateString() === today.toDateString()
    }).length

    const urgentTickets = mockTickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length
    const activeAgents = mockUsers.filter(u => u.role === 'agent' && u.status === 'online').length

    // Cálculo promedio de tiempo de respuesta (simulado)
    const avgResponseHours = 1.8

    // Score de satisfacción (simulado)
    const satisfactionScore = 4.3

    return {
      totalTickets: mockTickets.length,
      openTickets,
      inProgressTickets,
      resolvedToday,
      urgentTickets,
      avgResponseTime: avgResponseHours,
      satisfactionScore,
      activeAgents,
      pendingTickets: openTickets + inProgressTickets,
      escalatedTickets: urgentTickets
    }
  }, [])

  // Datos para gráficos
  const ticketsByChannel = useMemo(() => {
    return mockTickets.reduce((acc, ticket) => {
      acc[ticket.channel] = (acc[ticket.channel] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [])

  const ticketsByPriority = useMemo(() => {
    return mockTickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [])

  const ticketsByStatus = useMemo(() => {
    return mockTickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [])

  // Actividad reciente calculada
  const recentActivity = useMemo(() => {
    return mockDashboardMetrics.recentActivity.map(activity => ({
      ...activity,
      timeAgo: getTimeAgo(activity.timestamp)
    }))
  }, [])

  function getTimeAgo(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)

    if (diffMinutes < 1) return 'Ahora'
    if (diffMinutes < 60) return `Hace ${diffMinutes}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    return `Hace ${Math.floor(diffHours / 24)}d`
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
              title={t('dashboard.totalTickets')}
              value={metrics.totalTickets}
              trend="up"
              trendValue="+12%"
              description="vs mes anterior"
              icon={<BarChart3 className="h-4 w-4" />}
          />

          <MetricCard
              title={t('dashboard.openTickets')}
              value={metrics.openTickets}
              trend="down"
              trendValue="-5%"
              description="vs ayer"
              icon={<AlertTriangle className="h-4 w-4" />}
          />

          <MetricCard
              title={t('dashboard.resolvedToday')}
              value={metrics.resolvedToday}
              trend="up"
              trendValue="+23%"
              description="vs ayer"
              icon={<CheckCircle className="h-4 w-4" />}
          />

          <MetricCard
              title={t('dashboard.avgResponseTime')}
              value={`${metrics.avgResponseTime}h`}
              trend="down"
              trendValue="-15min"
              description="mejora"
              icon={<Clock className="h-4 w-4" />}
          />
        </div>

        {/* Métricas Secundarias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
              title={t('dashboard.satisfactionScore')}
              value={metrics.satisfactionScore}
              trend="up"
              trendValue="+0.2"
              description="de 5.0"
              icon={<Star className="h-4 w-4" />}
          />

          <MetricCard
              title={t('dashboard.activeAgents')}
              value={metrics.activeAgents}
              description="de 15 total"
              icon={<Users className="h-4 w-4" />}
          />

          <MetricCard
              title={t('dashboard.pendingTickets')}
              value={metrics.pendingTickets}
              trend={metrics.pendingTickets > 50 ? "up" : "down"}
              trendValue={metrics.pendingTickets > 50 ? "Alto" : "Normal"}
              icon={<MessageSquare className="h-4 w-4" />}
          />

          <MetricCard
              title={t('dashboard.escalatedTickets')}
              value={metrics.escalatedTickets}
              trend={metrics.escalatedTickets > 0 ? "up" : "stable"}
              trendValue={metrics.escalatedTickets > 0 ? "Atención" : "Normal"}
              icon={<AlertTriangle className="h-4 w-4" />}
              className={metrics.escalatedTickets > 0 ? "border-red-200" : ""}
          />
        </div>

        {/* Gráficos y Actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets por Canal */}
          <SimpleChart
              data={ticketsByChannel}
              title={t('dashboard.ticketsByChannel')}
          />

          {/* Tickets por Prioridad */}
          <SimpleChart
              data={ticketsByPriority}
              title={t('dashboard.ticketsByPriority')}
          />

          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t('dashboard.recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{activity.user.name}</span>
                        <span>•</span>
                        <span>{activity.timeAgo}</span>
                      </div>
                    </div>
                  </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumen por Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Tickets</CardTitle>
            <CardDescription>
              Distribución actual de tickets por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(ticketsByStatus).map(([status, count]) => (
                  <div key={status} className="text-center space-y-2">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {t(`tickets.${status}`)}
                    </div>
                    <Progress
                        value={(count / metrics.totalTickets) * 100}
                        className="h-2"
                    />
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
