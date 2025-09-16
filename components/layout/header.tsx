// components/header.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp, useAuth } from '@/context/AppContext'
import { apiService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
    Search,
    Bell,
    User,
    LogOut,
    Settings,
    Sun,
    Moon,
    Monitor,
    Globe,
    Menu,
    ChevronDown
} from 'lucide-react'

export function Header() {
    const { state, setTheme, setLanguage, toggleSidebar } = useApp()
    const { logout } = useAuth()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const [showThemeMenu, setShowThemeMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    // Funciones para cambios sin console.log
    const changeTheme = (theme: 'light' | 'dark' | 'system') => {
        setTheme(theme)
        setShowThemeMenu(false)
    }

    const changeLanguage = (language: 'en' | 'es') => {
        setLanguage(language)
        setShowLanguageMenu(false)
    }

    const getThemeIcon = () => {
        switch (state.theme) {
            case 'light':
                return <Sun className="h-4 w-4" />
            case 'dark':
                return <Moon className="h-4 w-4" />
            default:
                return <Monitor className="h-4 w-4" />
        }
    }

    const getLanguageDisplay = () => {
        return state.language === 'es' ? 'ES' : 'EN'
    }

    // Cerrar menus cuando se hace click fuera
    const closeAllMenus = () => {
        setShowLanguageMenu(false)
        setShowThemeMenu(false)
        setShowNotifications(false)
        setShowUserMenu(false)
    }

    return (
        <>
            {/* Overlay para cerrar menus */}
            {(showLanguageMenu || showThemeMenu || showNotifications || showUserMenu) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={closeAllMenus}
                />
            )}

            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left section - Mobile menu + Search */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Mobile menu button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden flex-shrink-0"
                                onClick={toggleSidebar}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            {/* Search bar - Responsive width */}
                            <div className="flex-1 max-w-sm">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right section - Controls with proper spacing */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            {/* Language selector */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 px-2 sm:px-3"
                                    onClick={() => {
                                        closeAllMenus()
                                        setShowLanguageMenu(!showLanguageMenu)
                                    }}
                                >
                                    <Globe className="h-4 w-4" />
                                    <span className="hidden sm:inline text-sm">{getLanguageDisplay()}</span>
                                    <ChevronDown className="h-3 w-3" />
                                </Button>

                                {showLanguageMenu && (
                                    <Card className="absolute top-full right-0 mt-2 w-44 shadow-lg z-50">
                                        <CardContent className="p-2">
                                            <div className="text-xs font-medium text-muted-foreground px-2 py-1.5 border-b mb-1">
                                                Idioma / Language
                                            </div>
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => changeLanguage('es')}
                                                    className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors ${
                                                        state.language === 'es' ? 'bg-accent' : ''
                                                    }`}
                                                >
                                                    🇪🇸 Español
                                                </button>
                                                <button
                                                    onClick={() => changeLanguage('en')}
                                                    className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors ${
                                                        state.language === 'en' ? 'bg-accent' : ''
                                                    }`}
                                                >
                                                    🇺🇸 English
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Theme selector */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 sm:px-3"
                                    onClick={() => {
                                        closeAllMenus()
                                        setShowThemeMenu(!showThemeMenu)
                                    }}
                                >
                                    {getThemeIcon()}
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                </Button>

                                {showThemeMenu && (
                                    <Card className="absolute top-full right-0 mt-2 w-44 shadow-lg z-50">
                                        <CardContent className="p-2">
                                            <div className="text-xs font-medium text-muted-foreground px-2 py-1.5 border-b mb-1">
                                                Tema / Theme
                                            </div>
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => changeTheme('light')}
                                                    className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors flex items-center gap-2 ${
                                                        state.theme === 'light' ? 'bg-accent' : ''
                                                    }`}
                                                >
                                                    <Sun className="h-4 w-4" />
                                                    <span className="text-xs">Claro</span>
                                                </button>
                                                <button
                                                    onClick={() => changeTheme('dark')}
                                                    className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors flex items-center gap-2 ${
                                                        state.theme === 'dark' ? 'bg-accent' : ''
                                                    }`}
                                                >
                                                    <Moon className="h-4 w-4" />
                                                    <span className="text-xs">Oscuro</span>
                                                </button>
                                                <button
                                                    onClick={() => changeTheme('system')}
                                                    className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors flex items-center gap-2 ${
                                                        state.theme === 'system' ? 'bg-accent' : ''
                                                    }`}
                                                >
                                                    <Monitor className="h-4 w-4" />
                                                    <span className="text-xs">Sistema</span>
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="relative px-2 sm:px-3"
                                    onClick={() => {
                                        closeAllMenus()
                                        setShowNotifications(!showNotifications)
                                    }}
                                >
                                    <Bell className="h-4 w-4" />
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
                                    >
                                        3
                                    </Badge>
                                </Button>

                                {showNotifications && (
                                    <Card className="absolute top-full right-0 mt-2 w-72 sm:w-80 shadow-lg z-50">
                                        <CardContent className="p-3">
                                            <div className="text-sm font-medium text-muted-foreground px-1 py-1.5 border-b mb-2">
                                                Notificaciones
                                            </div>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                <div className="p-2 rounded hover:bg-accent cursor-pointer">
                                                    <div className="font-medium text-xs">Nuevo ticket asignado</div>
                                                    <div className="text-xs text-muted-foreground">TK-2024-005 - Problema con pagos</div>
                                                    <div className="text-xs text-muted-foreground mt-1">Hace 5 minutos</div>
                                                </div>
                                                <div className="p-2 rounded hover:bg-accent cursor-pointer">
                                                    <div className="font-medium text-xs">Ticket escalado</div>
                                                    <div className="text-xs text-muted-foreground">TK-2024-003 requiere atención</div>
                                                    <div className="text-xs text-muted-foreground mt-1">Hace 15 minutos</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* User menu */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="relative p-1"
                                    onClick={() => {
                                        closeAllMenus()
                                        setShowUserMenu(!showUserMenu)
                                    }}
                                >
                                    <Avatar className="h-7 w-7">
                                        <AvatarImage src="/placeholder-user.jpg" alt={state.user?.name} />
                                        <AvatarFallback className="text-xs">
                                            {state.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>

                                {showUserMenu && (
                                    <Card className="absolute top-full right-0 mt-2 w-48 shadow-lg z-50">
                                        <CardContent className="p-2">
                                            <div className="px-2 py-1.5 border-b mb-1">
                                                <p className="text-xs font-medium leading-none truncate">{state.user?.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                                                    {state.user?.email}
                                                </p>
                                            </div>
                                            <div className="space-y-1 mt-2">
                                                <button className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-accent transition-colors flex items-center gap-2">
                                                    <User className="h-3 w-3" />
                                                    Perfil
                                                </button>
                                                <button className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-accent transition-colors flex items-center gap-2">
                                                    <Settings className="h-3 w-3" />
                                                    Configuración
                                                </button>
                                                <div className="border-t my-1"></div>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await logout()
                                                            closeAllMenus()
                                                            router.push('/login')
                                                        } catch (error) {
                                                            console.error('Error durante logout:', error)
                                                            router.push('/login')
                                                        }
                                                    }}
                                                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-2 text-destructive"
                                                >
                                                    <LogOut className="h-3 w-3" />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
