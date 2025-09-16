// hooks/use-security.ts
'use client'

import { useState, useMemo } from 'react'

export interface SecurityEvent {
    id: string
    type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'permission_change' | 'suspicious_activity'
    user: string
    description: string
    ip: string
    userAgent: string
    timestamp: Date
    severity: 'low' | 'medium' | 'high' | 'critical'
    status: 'resolved' | 'investigating' | 'pending'
}

export interface SecurityPolicy {
    id: string
    name: string
    description: string
    enabled: boolean
    category: 'authentication' | 'access' | 'data' | 'monitoring'
    level: 'basic' | 'enhanced' | 'strict'
}

const mockSecurityEvents: SecurityEvent[] = [
    {
        id: 'event-1',
        type: 'suspicious_activity',
        user: 'ana.garcia@example.com',
        description: 'Multiple failed login attempts from unknown IP',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'high',
        status: 'investigating'
    },
    {
        id: 'event-2',
        type: 'login',
        user: 'carlos.rodriguez@example.com',
        description: 'Successful login from new device',
        ip: '10.0.0.45',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        severity: 'low',
        status: 'resolved'
    },
    {
        id: 'event-3',
        type: 'permission_change',
        user: 'admin@example.com',
        description: 'User role changed from agent to admin',
        ip: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        severity: 'medium',
        status: 'resolved'
    },
    {
        id: 'event-4',
        type: 'failed_login',
        user: 'unknown@attacker.com',
        description: 'Failed login attempt with invalid credentials',
        ip: '203.0.113.42',
        userAgent: 'curl/7.68.0',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        severity: 'medium',
        status: 'pending'
    },
    {
        id: 'event-5',
        type: 'password_change',
        user: 'maria.lopez@example.com',
        description: 'Password changed successfully',
        ip: '192.168.1.75',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        severity: 'low',
        status: 'resolved'
    }
]

const mockSecurityPolicies: SecurityPolicy[] = [
    {
        id: 'policy-1',
        name: 'Two-Factor Authentication',
        description: 'Require 2FA for all user accounts',
        enabled: true,
        category: 'authentication',
        level: 'enhanced'
    },
    {
        id: 'policy-2',
        name: 'Password Complexity',
        description: 'Enforce strong password requirements',
        enabled: true,
        category: 'authentication',
        level: 'basic'
    },
    {
        id: 'policy-3',
        name: 'Session Timeout',
        description: 'Automatic logout after inactivity',
        enabled: true,
        category: 'access',
        level: 'basic'
    },
    {
        id: 'policy-4',
        name: 'IP Whitelist',
        description: 'Restrict access to approved IP addresses',
        enabled: false,
        category: 'access',
        level: 'strict'
    },
    {
        id: 'policy-5',
        name: 'Data Encryption',
        description: 'Encrypt sensitive data at rest and in transit',
        enabled: true,
        category: 'data',
        level: 'enhanced'
    },
    {
        id: 'policy-6',
        name: 'Audit Logging',
        description: 'Log all security-relevant activities',
        enabled: true,
        category: 'monitoring',
        level: 'basic'
    }
]

export function useSecurity() {
    const [securityEvents] = useState<SecurityEvent[]>(mockSecurityEvents)
    const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>(mockSecurityPolicies)
    const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null)

    const securityStats = useMemo(() => {
        const totalEvents = securityEvents.length
        const criticalEvents = securityEvents.filter(e => e.severity === 'critical').length
        const pendingEvents = securityEvents.filter(e => e.status === 'pending').length
        const investigatingEvents = securityEvents.filter(e => e.status === 'investigating').length
        const enabledPolicies = securityPolicies.filter(p => p.enabled).length
        const totalPolicies = securityPolicies.length

        return {
            totalEvents,
            criticalEvents,
            pendingEvents,
            investigatingEvents,
            enabledPolicies,
            totalPolicies,
            policyCompliancePercentage: Math.round((enabledPolicies / totalPolicies) * 100)
        }
    }, [securityEvents, securityPolicies])

    const recentEvents = useMemo(() => {
        return [...securityEvents]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5)
    }, [securityEvents])

    const criticalEvents = useMemo(() => {
        return securityEvents.filter(event =>
            event.severity === 'critical' || event.severity === 'high'
        ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }, [securityEvents])

    const getSeverityColor = (severity: SecurityEvent['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800'
            case 'high': return 'bg-orange-100 text-orange-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'low': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status: SecurityEvent['status']) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800'
            case 'investigating': return 'bg-blue-100 text-blue-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getLevelColor = (level: SecurityPolicy['level']) => {
        switch (level) {
            case 'strict': return 'bg-red-100 text-red-800'
            case 'enhanced': return 'bg-blue-100 text-blue-800'
            case 'basic': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getEventIcon = (type: SecurityEvent['type']) => {
        const iconMap = {
            login: 'log-in',
            logout: 'log-out',
            failed_login: 'x-circle',
            password_change: 'key',
            permission_change: 'shield',
            suspicious_activity: 'alert-triangle'
        }
        return iconMap[type] || 'help-circle'
    }

    const togglePolicy = (policyId: string) => {
        setSecurityPolicies(prev => prev.map(policy => {
            if (policy.id === policyId) {
                return { ...policy, enabled: !policy.enabled }
            }
            return policy
        }))
    }

    const updateEventStatus = (eventId: string, status: SecurityEvent['status']) => {
        // This would typically update the backend
        console.log(`Event ${eventId} status updated to ${status}`)
    }

    return {
        securityEvents,
        securityPolicies,
        securityStats,
        recentEvents,
        criticalEvents,
        selectedEvent,
        setSelectedEvent,
        getSeverityColor,
        getStatusColor,
        getLevelColor,
        getEventIcon,
        togglePolicy,
        updateEventStatus
    }
}