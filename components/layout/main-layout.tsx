// components/main-layout.tsx
'use client'

import { useSidebar } from '@/context/AppContext'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { AuthGuard } from '../shared/auth-guard'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    const { collapsed } = useSidebar()

    return (
        <AuthGuard>
            <div className="h-screen flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                {/* Main content area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main content */}
                    <main
                        className={cn(
                            "flex-1 overflow-y-auto bg-background transition-all duration-300 ease-in-out",
                            "p-6 md:p-8"
                        )}
                    >
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}
