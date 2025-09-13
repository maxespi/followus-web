// components/sidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useApp, useTranslation, useSidebar } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    LayoutDashboard,
    Ticket,
    MessageSquare,
    BookOpen,
    BarChart3,
    Settings,
    Users,
    Shield,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { mockNavigation, mockDashboardMetrics } from '@/lib/mock-data'

// Mapeo de iconos
const iconMap = {
    LayoutDashboard,
    Ticket,
    MessageSquare,
    BookOpen,
    BarChart3,
    Users,
    Shield,
    Settings
}

export function Sidebar() {
    const pathname = usePathname()
    const { t } = useTranslation()
    const { collapsed, toggle, setCollapsed } = useSidebar()

    // Función para obtener el ícono por nombre
    const getIcon = (iconName: string) => {
        const Icon = iconMap[iconName as keyof typeof iconMap]
        return Icon ? <Icon className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />
    }

    // Función para obtener el badge de cada item
    const getBadgeForItem = (href: string) => {
        switch (href) {
            case '/tickets':
                return mockDashboardMetrics.openTickets
            case '/analytics':
                return mockDashboardMetrics.escalatedTickets > 0 ? mockDashboardMetrics.escalatedTickets : undefined
            default:
                return undefined
        }
    }

    return (
        <aside
            className={cn(
                "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                {!collapsed && (
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">F</span>
                        </div>
                        <span className="text-xl font-bold text-sidebar-foreground">FollowUS</span>
                    </Link>
                )}

                {collapsed && (
                    <Link href="/" className="flex items-center justify-center w-full">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">F</span>
                        </div>
                    </Link>
                )}
            </div>

            {/* Toggle button */}
            <div className="flex justify-end p-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggle}
                    className="h-8 w-8 p-0"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <Separator />

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-2">
                    {mockNavigation.map((item) => {
                        const isActive = pathname === item.href
                        const badge = getBadgeForItem(item.href)

                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        collapsed ? "px-2" : "px-3",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    )}
                                    title={collapsed ? t(item.nameKey) : undefined}
                                >
                                    {getIcon(item.icon)}
                                    {!collapsed && (
                                        <>
                                            <span className="flex-1 text-left">{t(item.nameKey)}</span>
                                            {badge && (
                                                <Badge
                                                    variant={isActive ? "secondary" : "default"}
                                                    className={cn(
                                                        "ml-auto",
                                                        isActive ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground" : ""
                                                    )}
                                                >
                                                    {badge}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </ScrollArea>

            {/* Footer info */}
            {!collapsed && (
                <div className="p-4 border-t border-sidebar-border">
                    <div className="text-xs text-sidebar-foreground/60 space-y-1">
                        <div className="flex justify-between">
                            <span>{t('tickets.open')}:</span>
                            <span className="font-medium">{mockDashboardMetrics.openTickets}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('dashboard.activeAgents')}:</span>
                            <span className="font-medium">{mockDashboardMetrics.activeAgents}</span>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    )
}
