// components/security-overview.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Shield,
    AlertTriangle,
    Lock,
    Eye,
    Key,
    Activity,
    CheckCircle,
    XCircle,
    Clock,
    Globe
} from 'lucide-react'

export function SecurityOverview() {
    const { t } = useTranslation()

    const securityLogs = [
        {
            id: 'log-1',
            type: 'login_success',
            user: 'Ana García',
            ip: '192.168.1.100',
            timestamp: new Date(Date.now() - 300000),
            risk: 'low'
        },
        {
            id: 'log-2',
            type: 'failed_login',
            user: 'unknown',
            ip: '203.0.113.45',
            timestamp: new Date(Date.now() - 600000),
            risk: 'medium'
        },
        {
            id: 'log-3',
            type: 'permission_change',
            user: 'Admin System',
            ip: '192.168.1.1',
            timestamp: new Date(Date.now() - 1200000),
            risk: 'high'
        }
    ]

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        }).format(date)
    }

    const getRiskColor = (risk: string) => {
        const colors = {
            low: 'secondary',
            medium: 'default',
            high: 'destructive'
        }
        return colors[risk as keyof typeof colors] || 'secondary'
    }

    const getLogIcon = (type: string) => {
        const icons = {
            login_success: <CheckCircle className="h-4 w-4 text-green-500" />,
            failed_login: <XCircle className="h-4 w-4 text-red-500" />,
            permission_change: <Key className="h-4 w-4 text-yellow-500" />
        }
        return icons[type as keyof typeof icons] || <Activity className="h-4 w-4" />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Seguridad</h1>
                    <p className="text-muted-foreground">
                        Monitoreo de seguridad, logs de actividad y configuración de políticas
                    </p>
                </div>
                <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Auditoría Completa
                </Button>
            </div>

            {/* Estado de Seguridad */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estado General</CardTitle>
                        <Shield className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Seguro</div>
                        <p className="text-xs text-muted-foreground">Todos los sistemas operativos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Amenazas Activas</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">intentos de acceso bloqueados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sesiones Activas</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">usuarios conectados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Última Auditoría</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2h</div>
                        <p className="text-xs text-muted-foreground">hace 2 horas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Configuración y Logs */}
            <Tabs defaultValue="logs" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="logs">Logs de Actividad</TabsTrigger>
                    <TabsTrigger value="policies">Políticas</TabsTrigger>
                    <TabsTrigger value="access">Control de Acceso</TabsTrigger>
                </TabsList>

                <TabsContent value="logs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                            <CardDescription>Eventos de seguridad y accesos al sistema</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {securityLogs.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            {getLogIcon(log.type)}
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {log.type === 'login_success' && 'Inicio de sesión exitoso'}
                                                    {log.type === 'failed_login' && 'Intento de acceso fallido'}
                                                    {log.type === 'permission_change' && 'Cambio de permisos'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Usuario: {log.user} | IP: {log.ip} | {formatTime(log.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={getRiskColor(log.risk) as any}>
                                            {log.risk === 'low' && 'Bajo riesgo'}
                                            {log.risk === 'medium' && 'Riesgo medio'}
                                            {log.risk === 'high' && 'Alto riesgo'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="policies" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Políticas de Contraseña</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Longitud mínima (8 caracteres)</span>
                                    <Switch checked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Requiere mayúsculas</span>
                                    <Switch checked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Requiere números</span>
                                    <Switch checked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Caducidad (90 días)</span>
                                    <Switch checked />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuración de Sesión</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Timeout automático (30 min)</span>
                                    <Switch checked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Autenticación de dos factores</span>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Recordar dispositivo</span>
                                    <Switch checked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Sesiones múltiples</span>
                                    <Switch checked />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="access" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Control de Acceso por IP</CardTitle>
                            <CardDescription>Configuración de direcciones IP permitidas y bloqueadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-2">IPs Permitidas</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                                <span>192.168.1.0/24</span>
                                                <Badge variant="secondary">Red interna</Badge>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                                <span>203.0.113.0/24</span>
                                                <Badge variant="secondary">Oficina remota</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">IPs Bloqueadas</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                                                <span>198.51.100.45</span>
                                                <Badge variant="destructive">Intentos maliciosos</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
