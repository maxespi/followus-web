// components/auth-guard.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AppContext'
import { Loader2, Shield, ShieldX } from 'lucide-react'

interface AuthGuardProps {
    children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isAuthLoading, user } = useAuth()
    const router = useRouter()

    useEffect(() => {

        // Solo redirigir si no está cargando y no está autenticado
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isAuthLoading, router])

    // Estado de carga: verificando autenticación
    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <div className="relative">
                        <Shield className="h-8 w-8" />
                        <Loader2 className="h-4 w-4 animate-spin absolute -top-1 -right-1" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Verificando autenticación...</p>
                        <p className="text-sm">Validando sesión con el servidor</p>
                    </div>
                </div>
            </div>
        )
    }

    // Usuario no autenticado: mostrar mensaje antes de redirigir
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <ShieldX className="h-8 w-8 text-destructive" />
                    <div className="text-center">
                        <p className="font-medium">Acceso no autorizado</p>
                        <p className="text-sm">Redirigiendo al login...</p>
                    </div>
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            </div>
        )
    }

    // Usuario autenticado: mostrar contenido
    return <>{children}</>
}