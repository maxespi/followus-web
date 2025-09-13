// components/analytics-overview.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Clock,
    Users,
    MessageSquare,
    Star,
    Calendar,
    Download,
    Filter
} from 'lucide-react'

export function AnalyticsOverview() {
    const { t } = useTranslation()
    const [dateRange, setDateRange] = useState('7d')

    const analyticsData = {
        performance: {
            totalTickets: 1247,
            avgResolutionTime: 4.2,
            firstResponseTime: 1.8,
            satisfactionScore: 4.3,
            agentUtilization: 78
        },
        trends: {
            ticketsGrowth: 12,
            resolutionImprovement: -15,
            satisfactionTrend: 8,
            responseImprovement: -22
        },
        channelStats: [
            { name: 'Email', tickets: 456, satisfaction: 4.2, avgTime: 5.1 },
            { name: 'Chat', tickets: 324, satisfaction: 4.6, avgTime: 2.3 },
            { name: 'Phone', tickets: 198, satisfaction: 4.1, avgTime: 6.2 },
            { name: 'Social', tickets: 167, satisfaction: 3.9, avgTime: 8.1 },
            { name: 'Web', tickets: 102, satisfaction: 4.4, avgTime: 3.7 }
        ],
        agentPerformance: [
            { name: 'Ana García', tickets: 89, satisfaction: 4.7, avgTime: 3.2 },
            { name: 'Carlos Rodríguez', tickets: 76, satisfaction: 4.5, avgTime: 3.8 },
            { name: 'María López', tickets: 67, satisfaction: 4.3, avgTime: 4.1 }
        ]
    }

    const MetricCard = ({ title, value, trend, trendValue, icon, suffix = '' }: any) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}{suffix}</div>
                {trend && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        {trend > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(trend)}% vs período anterior
            </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">
                        Análisis detallado de rendimiento y métricas del sistema
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Últimos 7 días</SelectItem>
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                            <SelectItem value="90d">Últimos 90 días</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total de Tickets"
                    value={analyticsData.performance.totalTickets}
                    trend={analyticsData.trends.ticketsGrowth}
                    icon={<BarChart3 className="h-4 w-4" />}
                />
                <MetricCard
                    title="Tiempo Resolución"
                    value={analyticsData.performance.avgResolutionTime}
                    suffix="h"
                    trend={analyticsData.trends.resolutionImprovement}
                    icon={<Clock className="h-4 w-4" />}
                />
                <MetricCard
                    title="Primera Respuesta"
                    value={analyticsData.performance.firstResponseTime}
                    suffix="h"
                    trend={analyticsData.trends.responseImprovement}
                    icon={<MessageSquare className="h-4 w-4" />}
                />
                <MetricCard
                    title="Satisfacción"
                    value={analyticsData.performance.satisfactionScore}
                    suffix="/5"
                    trend={analyticsData.trends.satisfactionTrend}
                    icon={<Star className="h-4 w-4" />}
                />
            </div>

            {/* Análisis Detallado */}
            <Tabs defaultValue="channels" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="channels">Por Canal</TabsTrigger>
                    <TabsTrigger value="agents">Por Agente</TabsTrigger>
                    <TabsTrigger value="trends">Tendencias</TabsTrigger>
                </TabsList>

                <TabsContent value="channels" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rendimiento por Canal</CardTitle>
                            <CardDescription>Métricas de cada canal de comunicación</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.channelStats.map((channel) => (
                                    <div key={channel.name} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{channel.name}</span>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>{channel.tickets} tickets</span>
                                                <span>⭐ {channel.satisfaction}</span>
                                                <span>⏱️ {channel.avgTime}h</span>
                                            </div>
                                        </div>
                                        <Progress value={(channel.tickets / 500) * 100} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="agents" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rendimiento por Agente</CardTitle>
                            <CardDescription>Métricas individuales de cada agente</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.agentPerformance.map((agent) => (
                                    <div key={agent.name} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{agent.name}</p>
                                            <p className="text-sm text-muted-foreground">{agent.tickets} tickets resueltos</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <Badge variant="outline">⭐ {agent.satisfaction}</Badge>
                                            <Badge variant="outline">⏱️ {agent.avgTime}h</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tendencias de Volumen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    <div className="text-center">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Gráfico de tendencias de tickets</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Tendencias de Satisfacción</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    <div className="text-center">
                                        <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Gráfico de satisfacción del cliente</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
