// hooks/use-channel-management.ts
'use client'

import { useState, useMemo } from 'react'

export interface Channel {
    id: string
    name: string
    type: 'email' | 'chat' | 'phone' | 'social' | 'web'
    status: 'active' | 'inactive' | 'maintenance'
    connectedSince: Date
    totalTickets: number
    activeTickets: number
    avgResponseTime: number
    satisfactionScore: number
    configuration: {
        autoAssign: boolean
        priority: 'low' | 'medium' | 'high'
        businessHours: boolean
        notifications: boolean
    }
}

const mockChannels: Channel[] = [
    {
        id: 'channel-1',
        name: 'Email Support',
        type: 'email',
        status: 'active',
        connectedSince: new Date('2023-01-01'),
        totalTickets: 456,
        activeTickets: 23,
        avgResponseTime: 5.1,
        satisfactionScore: 4.2,
        configuration: {
            autoAssign: true,
            priority: 'medium',
            businessHours: true,
            notifications: true
        }
    },
    {
        id: 'channel-2',
        name: 'Live Chat',
        type: 'chat',
        status: 'active',
        connectedSince: new Date('2023-01-15'),
        totalTickets: 324,
        activeTickets: 8,
        avgResponseTime: 2.3,
        satisfactionScore: 4.6,
        configuration: {
            autoAssign: true,
            priority: 'high',
            businessHours: false,
            notifications: true
        }
    },
    {
        id: 'channel-3',
        name: 'Phone Support',
        type: 'phone',
        status: 'active',
        connectedSince: new Date('2023-02-01'),
        totalTickets: 198,
        activeTickets: 12,
        avgResponseTime: 6.2,
        satisfactionScore: 4.1,
        configuration: {
            autoAssign: false,
            priority: 'high',
            businessHours: true,
            notifications: true
        }
    },
    {
        id: 'channel-4',
        name: 'Social Media',
        type: 'social',
        status: 'maintenance',
        connectedSince: new Date('2023-03-01'),
        totalTickets: 167,
        activeTickets: 5,
        avgResponseTime: 8.1,
        satisfactionScore: 3.9,
        configuration: {
            autoAssign: true,
            priority: 'medium',
            businessHours: true,
            notifications: false
        }
    },
    {
        id: 'channel-5',
        name: 'Web Portal',
        type: 'web',
        status: 'inactive',
        connectedSince: new Date('2023-04-01'),
        totalTickets: 102,
        activeTickets: 0,
        avgResponseTime: 3.7,
        satisfactionScore: 4.4,
        configuration: {
            autoAssign: true,
            priority: 'low',
            businessHours: false,
            notifications: true
        }
    }
]

export function useChannelManagement() {
    const [channels, setChannels] = useState<Channel[]>(mockChannels)
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

    const channelStats = useMemo(() => {
        const total = channels.length
        const active = channels.filter(c => c.status === 'active').length
        const totalTickets = channels.reduce((sum, c) => sum + c.totalTickets, 0)
        const totalActiveTickets = channels.reduce((sum, c) => sum + c.activeTickets, 0)
        const avgSatisfaction = channels.reduce((sum, c) => sum + c.satisfactionScore, 0) / total

        return {
            total,
            active,
            totalTickets,
            totalActiveTickets,
            avgSatisfaction: Number(avgSatisfaction.toFixed(1)),
            activePercentage: Math.round((active / total) * 100)
        }
    }, [channels])

    const getChannelIcon = (type: Channel['type']) => {
        const iconMap = {
            email: 'mail',
            chat: 'message-square',
            phone: 'phone',
            social: 'share',
            web: 'globe'
        }
        return iconMap[type] || 'help-circle'
    }

    const getStatusColor = (status: Channel['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-gray-100 text-gray-800'
            case 'maintenance': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'low': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const toggleChannelStatus = (channelId: string) => {
        setChannels(prev => prev.map(channel => {
            if (channel.id === channelId) {
                const newStatus = channel.status === 'active' ? 'inactive' : 'active'
                return { ...channel, status: newStatus }
            }
            return channel
        }))
    }

    const updateChannelConfig = (channelId: string, config: Partial<Channel['configuration']>) => {
        setChannels(prev => prev.map(channel => {
            if (channel.id === channelId) {
                return {
                    ...channel,
                    configuration: { ...channel.configuration, ...config }
                }
            }
            return channel
        }))
    }

    return {
        channels,
        channelStats,
        selectedChannel,
        setSelectedChannel,
        getChannelIcon,
        getStatusColor,
        getPriorityColor,
        toggleChannelStatus,
        updateChannelConfig
    }
}