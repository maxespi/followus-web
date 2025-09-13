// components/user-management.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    UserPlus,
    Shield,
    Clock,
    Mail,
    Phone
} from 'lucide-react'

export function UserManagement() {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')

    const users = [
        {
            id: 'user-1',
            name: 'Ana García',
            email: 'ana.garcia@example.com',
            role: 'admin',
            status: 'online',
            lastSeen: new Date(),
            ticketsAssigned: 23,
            phone: '+56 9 8765 4321',
            joinDate: new Date('2023-01-15')
        },
        {
            id: 'user-2',
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@example.com',
            role: 'agent',
            status: 'online',
            lastSeen: new Date(),
            ticketsAssigned: 18,
            phone: '+56 9 1234 5678',
            joinDate: new Date('2023-03-22')
        },
        {
            id: 'user-3',
            name: 'María López',
            email: 'maria.lopez@example.com',
            role: 'agent',
            status: 'busy',
            lastSeen: new Date(Date.now() - 300000),
            ticketsAssigned: 15,
            phone: '+56 9 9876 5432',
            joinDate: new Date('2023-05-10')
        }
    ]

    const getRoleColor = (role: string) => {
        const colors = {
            admin: 'destructive',
            agent: 'default',
            customer: 'secondary'
        }
        return colors[role as keyof typeof colors] || 'secondary'
    }

    const getStatusColor = (status: string) => {
        const colors = {
            online: 'default',
            busy: 'secondary',
            offline: 'outline'
        }
        return colors[status as keyof typeof colors] || 'outline'
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground">
                        Administra usuarios, roles y permisos del sistema
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Buscar usuarios..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los roles</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="agent">Agente</SelectItem>
                                <SelectItem value="customer">Cliente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length + 97}</div>
                        <p className="text-xs text-muted-foreground">+3 este mes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Agentes Activos</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">de 15 total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Línea Ahora</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">agentes disponibles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nuevos Hoy</CardTitle>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">usuarios registrados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Usuarios */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="agents">Agentes</TabsTrigger>
                    <TabsTrigger value="admins">Administradores</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {users.map((user) => (
                            <Card key={user.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src="/placeholder-user.jpg" />
                                                <AvatarFallback>
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">{user.name}</h3>
                                                    <Badge variant={getRoleColor(user.role) as any}>
                                                        {user.role}
                                                    </Badge>
                                                    <Badge variant={getStatusColor(user.status) as any}>
                                                        {user.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {user.phone}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Tickets asignados: {user.ticketsAssigned} | Desde: {formatDate(user.joinDate)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="agents">
                    <div className="text-center py-8">
                        <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">Vista de agentes</p>
                    </div>
                </TabsContent>

                <TabsContent value="admins">
                    <div className="text-center py-8">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">Vista de administradores</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
