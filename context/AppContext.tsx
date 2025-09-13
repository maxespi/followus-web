// context/AppContext.tsx
'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Language, ThemeMode } from '@/lib/types'
import { getTranslation } from '@/lib/i18n'

// Estado de la aplicación
export interface AppState {
    theme: ThemeMode
    language: Language
    sidebarCollapsed: boolean
    isAuthenticated: boolean
    user: {
        id: string
        name: string
        email: string
        role: string
        empresas?: Array<{
            id: number
            nombre: string
        }>
        rasgosDistintivos?: string
    } | null
}

// Acciones disponibles
export type AppAction =
    | { type: 'SET_THEME'; payload: ThemeMode }
    | { type: 'SET_LANGUAGE'; payload: Language }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
    | { type: 'SET_USER'; payload: AppState['user'] }
    | { type: 'LOGIN'; payload: AppState['user'] }
    | { type: 'LOGOUT' }

// Estado inicial
const initialState: AppState = {
    theme: 'light',
    language: 'es',
    sidebarCollapsed: false,
    isAuthenticated: false,
    user: null
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, theme: action.payload }
        case 'SET_LANGUAGE':
            return { ...state, language: action.payload }
        case 'TOGGLE_SIDEBAR':
            return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
        case 'SET_SIDEBAR_COLLAPSED':
            return { ...state, sidebarCollapsed: action.payload }
        case 'SET_USER':
            return { ...state, user: action.payload }
        case 'LOGIN':
            return { ...state, user: action.payload, isAuthenticated: !!action.payload }
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false }
        default:
            return state
    }
}

// Context
interface AppContextType {
    state: AppState
    dispatch: React.Dispatch<AppAction>
    t: (key: string) => string
    setTheme: (theme: ThemeMode) => void
    setLanguage: (language: Language) => void
    toggleSidebar: () => void
    setSidebarCollapsed: (collapsed: boolean) => void
    login: (user: AppState['user']) => void
    logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState)

    // Función de traducción
    const t = (key: string): string => {
        return getTranslation(state.language, key)
    }

    // Acciones de conveniencia
    const setTheme = (theme: ThemeMode) => {
        console.log('Setting theme to:', theme) // Debug
        dispatch({ type: 'SET_THEME', payload: theme })
    }

    const setLanguage = (language: Language) => {
        console.log('Setting language to:', language) // Debug
        dispatch({ type: 'SET_LANGUAGE', payload: language })
    }

    const toggleSidebar = () => {
        dispatch({ type: 'TOGGLE_SIDEBAR' })
    }

    const setSidebarCollapsed = (collapsed: boolean) => {
        dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed })
    }

    const login = (user: AppState['user']) => {
        dispatch({ type: 'LOGIN', payload: user })
    }

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
    }

    // Cargar configuración guardada
    useEffect(() => {
        try {
            const saved = localStorage.getItem('followus-app-settings')
            if (saved) {
                const settings = JSON.parse(saved)
                if (settings.theme && ['light', 'dark', 'system'].includes(settings.theme)) {
                    dispatch({ type: 'SET_THEME', payload: settings.theme })
                }
                if (settings.language && ['en', 'es'].includes(settings.language)) {
                    dispatch({ type: 'SET_LANGUAGE', payload: settings.language })
                }
                if (typeof settings.sidebarCollapsed === 'boolean') {
                    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: settings.sidebarCollapsed })
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error)
        }
    }, [])

    // Guardar configuración cuando cambie
    useEffect(() => {
        try {
            const settings = {
                theme: state.theme,
                language: state.language,
                sidebarCollapsed: state.sidebarCollapsed
            }
            localStorage.setItem('followus-app-settings', JSON.stringify(settings))
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }, [state.theme, state.language, state.sidebarCollapsed])

    // Aplicar tema al document - SOLO manejar la clase 'dark'
    useEffect(() => {
        const root = document.documentElement

        if (state.theme === 'dark') {
            root.classList.add('dark')
        } else if (state.theme === 'light') {
            root.classList.remove('dark')
        } else {
            // system theme
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (isDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }

        console.log('Applied theme:', state.theme, 'Dark class:', root.classList.contains('dark')) // Debug
    }, [state.theme])

    // Escuchar cambios del tema del sistema
    useEffect(() => {
        if (state.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

            const handleChange = (e: MediaQueryListEvent) => {
                const root = document.documentElement
                if (e.matches) {
                    root.classList.add('dark')
                } else {
                    root.classList.remove('dark')
                }
            }

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
    }, [state.theme])

    // Debug: Log state changes
    useEffect(() => {
        console.log('App state changed:', state)
    }, [state])

    const contextValue: AppContextType = {
        state,
        dispatch,
        t,
        setTheme,
        setLanguage,
        toggleSidebar,
        setSidebarCollapsed,
        login,
        logout
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

// Hook para usar el contexto
export function useApp(): AppContextType {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}

// Hook específico para traducciones
export function useTranslation() {
    const { t, state } = useApp()
    return { t, language: state.language }
}

// Hook específico para tema
export function useTheme() {
    const { state, setTheme } = useApp()
    return { theme: state.theme, setTheme }
}

// Hook específico para sidebar
export function useSidebar() {
    const { state, toggleSidebar, setSidebarCollapsed } = useApp()
    return {
        collapsed: state.sidebarCollapsed,
        toggle: toggleSidebar,
        setCollapsed: setSidebarCollapsed
    }
}
