// context/AppContext.tsx
'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Language, ThemeMode } from '@/lib/types'
import { getTranslation } from '@/lib/i18n'
import { apiService } from '@/lib/api.service'

// Estado de la aplicación
export interface AppState {
    theme: ThemeMode
    language: Language
    sidebarCollapsed: boolean
    isAuthenticated: boolean
    isAuthLoading: boolean // Para manejar el estado de carga de autenticación
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
    | { type: 'SET_AUTH_LOADING'; payload: boolean }
    | { type: 'INITIALIZE_AUTH'; payload: { user: AppState['user']; isAuthenticated: boolean } }

// Estado inicial
const initialState: AppState = {
    theme: 'light',
    language: 'es',
    sidebarCollapsed: false,
    isAuthenticated: false,
    isAuthLoading: true, // Inicio cargando para validar token
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
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                isAuthLoading: false
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isAuthLoading: false
            }
        case 'SET_AUTH_LOADING':
            return { ...state, isAuthLoading: action.payload }
        case 'INITIALIZE_AUTH':
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: action.payload.isAuthenticated,
                isAuthLoading: false
            }
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
        dispatch({ type: 'SET_THEME', payload: theme })
    }

    const setLanguage = (language: Language) => {
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

    const logout = async () => {
        try {
            await apiService.logout()
        } catch (error) {
            console.error('Error during logout:', error)
        } finally {
            dispatch({ type: 'LOGOUT' })
        }
    }

    // Inicializar autenticación al cargar la app
    const initializeAuth = async () => {
        try {
            console.log('🔍 Iniciando validación de autenticación...')

            // Verificar si hay token almacenado
            const token = typeof window !== 'undefined' ? (
                localStorage.getItem('accessToken') || localStorage.getItem('token')
            ) : null

            console.log('🔑 Token encontrado:', token ? `${token.substring(0, 20)}...` : 'ninguno')

            if (!token) {
                console.log('❌ No hay token, marcando como no autenticado')
                dispatch({ type: 'INITIALIZE_AUTH', payload: { user: null, isAuthenticated: false } })
                return
            }

            // Validar token con el servidor
            console.log('📡 Validando token con servidor...')
            const profileResponse = await apiService.getCurrentUser()
            console.log('📨 Respuesta del servidor:', profileResponse)
            console.log('📨 Tipo de respuesta:', typeof profileResponse)
            console.log('📨 Keys de la respuesta:', Object.keys(profileResponse || {}))
            console.log('📨 Dispositivos:', profileResponse?.dispositivos)
            console.log('📨 Empresas:', profileResponse?.empresas)

            // El endpoint /perfil puede retornar directamente los datos o con wrapper
            let userData = null

            if (profileResponse.success && profileResponse.data) {
                console.log('✅ Formato con wrapper detectado')
                userData = profileResponse.data
            } else if (profileResponse.id && profileResponse.email) {
                console.log('✅ Formato directo detectado')
                userData = profileResponse
            } else if (profileResponse.empresas || profileResponse.dispositivos) {
                console.log('🔧 Formato parcial detectado - intentando extraer datos del token')
                // El servidor devuelve datos parciales, vamos a crear un usuario básico
                // y tratar de extraer el ID del token
                try {
                    const tokenData = JSON.parse(atob(token.split('.')[1])) // Decodificar payload del JWT
                    console.log('📋 Datos del token JWT:', tokenData)

                    userData = {
                        id: tokenData.id || tokenData.userId || 'temp-user',
                        nombre: tokenData.nombre || 'Usuario',
                        apellido: tokenData.apellido || 'Autenticado',
                        email: tokenData.email || 'usuario@sistema.com',
                        empresas: profileResponse.empresas || [],
                        dispositivos: profileResponse.dispositivos || [],
                        nivelAcceso: tokenData.nivelAcceso || 'user'
                    }
                    console.log('🔧 Usuario construido desde token:', userData)
                } catch (e) {
                    console.log('❌ Error decodificando token, usando datos básicos')
                    userData = {
                        id: 'temp-user',
                        nombre: 'Usuario',
                        apellido: 'Autenticado',
                        email: 'usuario@sistema.com',
                        empresas: profileResponse.empresas || [],
                        dispositivos: profileResponse.dispositivos || [],
                        nivelAcceso: 'user'
                    }
                }
            } else {
                console.log('❌ Formato de respuesta no reconocido:', profileResponse)
            }

            if (userData && userData.id) {
                // Normalizar datos del usuario
                const normalizedUser = {
                    id: userData.id.toString(),
                    name: `${userData.nombre || ''} ${userData.apellido || ''}`.trim(),
                    email: userData.email,
                    role: userData.nivelAcceso || 'user',
                    empresas: userData.empresas || [],
                    rasgosDistintivos: userData.rasgosDistintivos
                }

                dispatch({ type: 'INITIALIZE_AUTH', payload: { user: normalizedUser, isAuthenticated: true } })
                console.log('✅ Usuario autenticado persistentemente:', normalizedUser)
            } else {
                console.log('❌ Datos de usuario inválidos, limpiando tokens')
                // Token inválido, limpiar storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('token')
                    localStorage.removeItem('refreshToken')
                }
                dispatch({ type: 'INITIALIZE_AUTH', payload: { user: null, isAuthenticated: false } })
                console.log('❌ Token inválido, usuario no autenticado')
            }
        } catch (error) {
            console.error('❌ Error inicializando autenticación:', error)

            // Verificar el tipo de error
            if (error.message?.includes('401') || error.message?.includes('403')) {
                console.log('🔓 Token expirado o inválido, limpiando storage')
            } else {
                console.log('🌐 Error de red o servidor, limpiando tokens por seguridad')
            }

            // Error de red, limpiar tokens por seguridad
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
            }
            dispatch({ type: 'INITIALIZE_AUTH', payload: { user: null, isAuthenticated: false } })
        }
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

        // Applied theme: ${state.theme}
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

    // Inicializar autenticación al cargar la aplicación
    useEffect(() => {
        initializeAuth()
    }, []) // Solo se ejecuta una vez al montar el componente

    // App state management

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

// Hook específico para autenticación
export function useAuth() {
    const { state, login, logout } = useApp()
    return {
        isAuthenticated: state.isAuthenticated,
        isAuthLoading: state.isAuthLoading,
        user: state.user,
        login,
        logout
    }
}
