// components/dashboard-overview.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { tasksService, Ticket } from '@/lib/tasks.service'
import { useAuth } from '@/context/AppContext'
import { formatRelativeTime } from '@/lib/date-utils'
import { useTicketMetrics } from '@/hooks/use-ticket-metrics'

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
  const { user } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Hook centralizado para métricas (Single Source of Truth)
  const metrics = useTicketMetrics(tickets)

  // Cargar datos reales del backend
  const loadDashboardData = async () => {
    if (!user?.id) return

    try {
      setError(null)
      const userTasks = await tasksService.getUserTasks(Number(user.id))
      setTickets(userTasks)
    } catch (err) {
      console.error('❌ Error cargando dashboard:', err)
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [user?.id])

  // Las métricas ahora se calculan automáticamente en el hook centralizado

  // Datos para gráficos basados en datos reales
  // Los datos para gráficos ahora vienen del hook centralizado

  // Actividad reciente basada en datos reales (comentarios y actualizaciones)
  const recentActivity = useMemo(() => {
    const activities = []

    tickets.forEach(ticket => {
      // Agregar actividad de creación de ticket
      activities.push({
        id: `ticket-${ticket.id}-created`,
        description: `Ticket "${ticket.title}" fue creado`,
        user: {
          name: ticket.creator.name
        },
        timestamp: new Date(ticket.createdAt),
        timeAgo: getTimeAgo(new Date(ticket.createdAt))
      })

      // Agregar actividad de mensajes/comentarios recientes
      ticket.messages.slice(-2).forEach(message => {
        activities.push({
          id: `message-${message.id}`,
          description: `Nuevo comentario en "${ticket.title}"`,
          user: {
            name: message.author.name
          },
          timestamp: new Date(message.createdAt),
          timeAgo: getTimeAgo(new Date(message.createdAt))
        })
      })
    })

    // Ordenar por timestamp descendente y tomar las 10 más recientes
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  }, [tickets])

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
    await loadDashboardData()
    setRefreshing(false)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground text-red-500">{error}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              {loading ? 'Cargando datos...' : t('dashboard.subtitle')}
            </p>
          </div>
          <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing || loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${(refreshing || loading) ? 'animate-spin' : ''}`} />
            {loading ? 'Cargando...' : 'Actualizar'}
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
              value={`${metrics.percentages.resolved}%`}
              trend={metrics.resolvedToday > 0 ? "up" : "stable"}
              trendValue={metrics.resolvedToday > 0 ? `+${metrics.resolvedToday} hoy` : "0 hoy"}
              description={`${metrics.resolvedTickets} resueltos`}
              icon={<CheckCircle className="h-4 w-4" />}
          />

          <MetricCard
              title={t('dashboard.avgResponseTime')}
              value={Math.round(metrics.avgResponseTime * 10) / 10}
              trend={metrics.percentages.responseTimeVariation < 0 ? "up" : metrics.percentages.responseTimeVariation > 0 ? "down" : "stable"}
              trendValue={metrics.percentages.responseTimeVariation !== 0 ? `${metrics.percentages.responseTimeVariation > 0 ? '↑' : '↓'}${Math.abs(metrics.percentages.responseTimeVariation).toFixed(1)}%` : "→ 0%"}
              description={`${Math.round(metrics.avgResponseTime)}h promedio`}
              icon={<Clock className="h-4 w-4" />}
          />
        </div>

        {/* Métricas Secundarias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
              title={"Tickets Urgentes"}
              value={`${metrics.percentages.urgent}%`}
              trend={metrics.percentages.urgent > 10 ? "down" : "stable"}
              trendValue={metrics.percentages.urgent > 10 ? "Atención requerida" : "Bajo control"}
              description={`${metrics.urgentTickets} urgentes`}
              icon={<AlertTriangle className="h-4 w-4" />}
          />

          <MetricCard
              title={t('dashboard.activeAgents')}
              value={metrics.activeAgents}
              description={`de ${metrics.totalParticipants || metrics.activeAgents} total`}
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
              title={"Tickets Sin Asignar"}
              value={metrics.unassignedTickets}
              trend={metrics.escalatedTickets > 0 ? "up" : "stable"}
              trendValue={metrics.escalatedTickets > 0 ? "Atención" : "Normal"}
              icon={<AlertTriangle className="h-4 w-4" />}
              className={metrics.escalatedTickets > 0 ? "border-red-200" : ""}
          />
        </div>

        {/* Gráficos y Actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets por Categoría */}
          <SimpleChart
              data={metrics.ticketsByCategory}
              title="Tickets por Categoría"
          />

          {/* Tickets por Prioridad */}
          <SimpleChart
              data={metrics.ticketsByPriority}
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
              {Object.entries(metrics.ticketsByStatus).map(([status, count]) => (
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
