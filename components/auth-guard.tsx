// components/auth-guard.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
    children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { state } = useApp()
    const router = useRouter()

    useEffect(() => {
        if (!state.isAuthenticated) {
            router.push('/login')
        }
    }, [state.isAuthenticated, router])

    if (!state.isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verificando autenticación...</span>
                </div>
            </div>
        )
    }

    return <>{children}</>
}