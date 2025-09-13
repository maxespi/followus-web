// app/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AppContext'
import { apiService } from '@/lib/api.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, Wifi, WifiOff } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isDemoLoading, setIsDemoLoading] = useState(false)
    const [error, setError] = useState('')
    const [isServerOnline, setIsServerOnline] = useState<boolean | null>(null)

    const { isAuthenticated, isAuthLoading, login } = useAuth()
    const router = useRouter()

    // Redirect to dashboard if already authenticated (but only after loading finishes)
    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            console.log('✅ Usuario ya autenticado, redirigiendo a dashboard')
            router.push('/')
        }
    }, [isAuthenticated, isAuthLoading, router])

    // Check server connection on component mount
    useEffect(() => {
        checkServerConnection()
    }, [])

    const checkServerConnection = async () => {
        try {
            const isOnline = await apiService.checkServerHealth()
            setIsServerOnline(isOnline)
            console.log('Server connection status:', isOnline)
        } catch (error) {
            console.error('Failed to check server health:', error)
            setIsServerOnline(false)
        }
    }

    const handleRealLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Validate that email and password are provided
        if (!email.trim() || !password.trim()) {
            setError('Por favor ingresa email y contraseña')
            setIsLoading(false)
            return
        }

        try {
            console.log('Attempting real API login to:', process.env.NEXT_PUBLIC_API_URL)
            const response = await apiService.login(email, password)

            console.log('Login response:', response)

            if (response.success && response.data) {
                const userData = response.data

                console.log('Backend response:', userData)
                console.log('🔑 Token en respuesta:', userData.token ? `${userData.token.substring(0, 20)}...` : 'NO HAY TOKEN')

                // Check if user needs to change password
                if (userData.solicitarCambioPassword) {
                    setError('Debes cambiar tu contraseña antes de continuar. Por favor contacta al administrador.')
                    return
                }

                // Normalize user data format for the frontend
                const normalizedUser = {
                    id: userData.id.toString(),
                    name: `${userData.nombre} ${userData.apellido}`.trim(),
                    email: userData.email,
                    role: userData.nivelAcceso || 'user',
                    empresas: userData.empresas || [],
                    rasgosDistintivos: userData.rasgosDistintivos
                }

                console.log('Login successful, normalized user:', normalizedUser)
                login(normalizedUser)
                router.push('/')
            } else {
                console.log('Login failed:', response)
                setError(response.error || 'Credenciales inválidas. Verifica tu email y contraseña.')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('Error de conexión con el servidor. Verifica tu conexión de red.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDemoLogin = async () => {
        setIsDemoLoading(true)

        try {
            // Simulate loading for better UX
            await new Promise(resolve => setTimeout(resolve, 500))

            const demoUser = {
                id: 'demo-user-1',
                name: 'Usuario Demo',
                email: 'demo@example.com',
                role: 'user'
            }

            console.log('Demo login, user:', demoUser)
            login(demoUser)
            router.push('/')
        } catch (err) {
            console.error('Demo login error:', err)
        } finally {
            setIsDemoLoading(false)
        }
    }

    // Mostrar carga si se está validando autenticación
    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <div className="text-center">
                        <p className="font-medium">Verificando sesión...</p>
                        <p className="text-sm">Por favor espera</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">
                            FollowUS
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {isServerOnline === null ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : isServerOnline ? (
                                <Wifi className="h-4 w-4 text-green-500" />
                            ) : (
                                <WifiOff className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                                {isServerOnline === null ? 'Verificando...' :
                                 isServerOnline ? 'En línea' : 'Sin conexión'}
                            </span>
                        </div>
                    </div>
                    <CardDescription className="text-center">
                        Sistema de Autenticación FollowUS
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Real Login Form */}
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4 space-y-4">
                            <h3 className="font-medium text-sm flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Iniciar Sesión con Servidor
                                {isServerOnline === true && <Wifi className="h-3 w-3 text-green-500" />}
                                {isServerOnline === false && <WifiOff className="h-3 w-3 text-red-500" />}
                            </h3>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleRealLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="tu@ejemplo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || isServerOnline === false}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Autenticando...
                                        </>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </Button>

                                {isServerOnline === false && (
                                    <p className="text-sm text-red-600 text-center">
                                        Servidor no disponible. Usa el modo demo para continuar.
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Demo Mode Button */}
                        <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                            <h3 className="font-medium text-sm text-muted-foreground">
                                Modo Demostración
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Acceso rápido sin credenciales para probar la aplicación
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleDemoLogin}
                                disabled={isDemoLoading}
                            >
                                {isDemoLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cargando Demo...
                                    </>
                                ) : (
                                    'Entrar en Modo Demo'
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Development Info */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-xs">
                            <strong>Dev Info:</strong> API URL = {process.env.NEXT_PUBLIC_API_URL}
                            {process.env.NEXT_PUBLIC_USE_DEV_IP === 'true' && (
                                <span> (usando IP dev: {process.env.NEXT_PUBLIC_API_DEV_IP})</span>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}