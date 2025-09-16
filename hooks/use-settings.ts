// hooks/use-settings.ts
'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Language, ThemeMode } from '@/lib/types'

export interface AppSettings {
    general: {
        companyName: string
        supportEmail: string
        timezone: string
        language: Language
        theme: ThemeMode
    }
    notifications: {
        emailNotifications: boolean
        pushNotifications: boolean
        slackIntegration: boolean
        discordIntegration: boolean
    }
    system: {
        maintenanceMode: boolean
        debugMode: boolean
        autoBackup: boolean
        logRetention: number
    }
}

const defaultSettings: AppSettings = {
    general: {
        companyName: 'FollowUS',
        supportEmail: 'support@followus.com',
        timezone: 'America/Santiago',
        language: 'es',
        theme: 'light'
    },
    notifications: {
        emailNotifications: true,
        pushNotifications: true,
        slackIntegration: false,
        discordIntegration: false
    },
    system: {
        maintenanceMode: false,
        debugMode: false,
        autoBackup: true,
        logRetention: 30
    }
}

export function useSettings() {
    const { state, setTheme, setLanguage } = useApp()
    const [settings, setSettings] = useState<AppSettings>({
        ...defaultSettings,
        general: {
            ...defaultSettings.general,
            language: state.language,
            theme: state.theme
        }
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const updateGeneralSettings = (updates: Partial<AppSettings['general']>) => {
        setSettings(prev => ({
            ...prev,
            general: { ...prev.general, ...updates }
        }))
        setIsSaved(false)
    }

    const updateNotificationSettings = (updates: Partial<AppSettings['notifications']>) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, ...updates }
        }))
        setIsSaved(false)
    }

    const updateSystemSettings = (updates: Partial<AppSettings['system']>) => {
        setSettings(prev => ({
            ...prev,
            system: { ...prev.system, ...updates }
        }))
        setIsSaved(false)
    }

    const handleSave = async () => {
        setIsLoading(true)

        try {
            // Aplicar cambios de tema e idioma inmediatamente
            if (settings.general.theme !== state.theme) {
                setTheme(settings.general.theme)
            }
            if (settings.general.language !== state.language) {
                setLanguage(settings.general.language)
            }

            // Simular guardado en backend
            await new Promise(resolve => setTimeout(resolve, 1000))

            setIsSaved(true)
            setTimeout(() => setIsSaved(false), 3000)
        } catch (error) {
            console.error('Error saving settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetToDefaults = () => {
        setSettings({
            ...defaultSettings,
            general: {
                ...defaultSettings.general,
                language: state.language,
                theme: state.theme
            }
        })
        setIsSaved(false)
    }

    const timezones = [
        { value: 'America/Santiago', label: 'Santiago (GMT-3)' },
        { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
        { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
        { value: 'America/Mexico_City', label: 'Mexico City (GMT-6)' },
        { value: 'America/New_York', label: 'New York (GMT-5)' },
        { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
        { value: 'UTC', label: 'UTC (GMT+0)' }
    ]

    const languages = [
        { value: 'es' as Language, label: 'Español' },
        { value: 'en' as Language, label: 'English' }
    ]

    const themes = [
        { value: 'light' as ThemeMode, label: 'Light' },
        { value: 'dark' as ThemeMode, label: 'Dark' }
    ]

    return {
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
    }
}