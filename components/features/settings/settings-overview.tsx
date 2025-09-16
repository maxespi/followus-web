// components/settings-overview.tsx
'use client'

import { useSettings } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Settings,
    Globe,
    Bell,
    Mail,
    Database,
    Palette,
    Save,
    RefreshCw
} from 'lucide-react'

export function SettingsOverview() {
    const {
        settings,
        isLoading,
        isSaved,
        updateGeneralSettings,
        updateNotificationSettings,
        updateSystemSettings,
        handleSave,
        resetToDefaults,
        timezones,
        languages,
        themes
    } = useSettings()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Configuración</h1>
                    <p className="text-muted-foreground">
                        Configuración general del sistema y preferencias
                    </p>
                </div>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                </Button>
            </div>

            {/* Configuraciones */}
            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                    <TabsTrigger value="integrations">Integraciones</TabsTrigger>
                    <TabsTrigger value="system">Sistema</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Información General
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="company-name">Nombre de la Empresa</Label>
                                    <Input
                                        id="company-name"
                                        value={settings.general.companyName}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            general: { ...prev.general, companyName: e.target.value }
                                        }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="support-email">Email de Soporte</Label>
                                    <Input
                                        id="support-email"
                                        type="email"
                                        value={settings.general.supportEmail}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            general: { ...prev.general, supportEmail: e.target.value }
                                        }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="timezone">Zona Horaria</Label>
                                    <Select
                                        value={settings.general.timezone}
                                        onValueChange={(value) => setSettings(prev => ({
                                            ...prev,
                                            general: { ...prev.general, timezone: value }
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                                            <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                                            <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Apariencia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="language">Idioma</Label>
                                    <Select
                                        value={settings.general.language}
                                        onValueChange={(value) => setSettings(prev => ({
                                            ...prev,
                                            general: { ...prev.general, language: value }
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="es">🇪🇸 Español</SelectItem>
                                            <SelectItem value="en">🇺🇸 English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="theme">Tema</Label>
                                    <Select
                                        value={settings.general.theme}
                                        onValueChange={(value) => setSettings(prev => ({
                                            ...prev,
                                            general: { ...prev.general, theme: value }
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">☀️ Claro</SelectItem>
                                            <SelectItem value="dark">🌙 Oscuro</SelectItem>
                                            <SelectItem value="system">💻 Sistema</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Configuración de Notificaciones
                            </CardTitle>
                            <CardDescription>
                                Configura cómo y cuándo recibir notificaciones
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Notificaciones por Email</h4>
                                    <p className="text-sm text-muted-foreground">Recibir notificaciones importantes por correo</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.emailNotifications}
                                    onCheckedChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, emailNotifications: checked }
                                    }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Notificaciones Push</h4>
                                    <p className="text-sm text-muted-foreground">Notificaciones en tiempo real en el navegador</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.pushNotifications}
                                    onCheckedChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, pushNotifications: checked }
                                    }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Integraciones Externas</CardTitle>
                            <CardDescription>Conecta con servicios de terceros</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Slack</h4>
                                    <p className="text-sm text-muted-foreground">Enviar notificaciones a Slack</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.slackIntegration}
                                    onCheckedChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, slackIntegration: checked }
                                    }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Discord</h4>
                                    <p className="text-sm text-muted-foreground">Integración con Discord</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.discordIntegration}
                                    onCheckedChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, discordIntegration: checked }
                                    }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Configuración del Sistema
                            </CardTitle>
                            <CardDescription>
                                Configuraciones avanzadas y mantenimiento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Modo Mantenimiento</h4>
                                    <p className="text-sm text-muted-foreground">Deshabilitar acceso temporal al sistema</p>
                                </div>
                                <Switch
                                    checked={settings.system.maintenanceMode}
                                    onCheckedChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        system: { ...prev.system, maintenanceMode: checked }
                                    }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Respaldo Automático</h4>
                                    <p className="text-sm text-muted-foreground">Crear respaldos automáticos diarios</p>
                                </div>
                                <Switch
                                    checked={settings.system.autoBackup}
                                    onCheckedChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        system: { ...prev.system, autoBackup: checked }
                                    }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="log-retention">Retención de Logs (días)</Label>
                                <Input
                                    id="log-retention"
                                    type="number"
                                    value={settings.system.logRetention}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        system: { ...prev.system, logRetention: parseInt(e.target.value) }
                                    }))}
                                    className="w-32"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
