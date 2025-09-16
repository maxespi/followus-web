// hooks/use-analytics.ts
'use client'

import { useState, useMemo } from 'react'

export interface AnalyticsData {
    performance: {
        totalTickets: number
        avgResolutionTime: number
        firstResponseTime: number
        satisfactionScore: number
        agentUtilization: number
    }
    trends: {
        ticketsGrowth: number
        resolutionImprovement: number
        satisfactionTrend: number
        responseImprovement: number
    }
    channelStats: Array<{
        name: string
        tickets: number
        satisfaction: number
        avgTime: number
    }>
    agentPerformance: Array<{
        name: string
        ticketsResolved: number
        avgTime: number
        satisfaction: number
        status: 'excellent' | 'good' | 'needs-improvement'
    }>
}

const mockAnalyticsData: AnalyticsData = {
    performance: {
        totalTickets: 1247,
        avgResolutionTime: 4.2,
        firstResponseTime: 1.8,
        satisfactionScore: 4.3,
        agentUtilization: 78
    },
    trends: {
        ticketsGrowth: 12,
        resolutionImprovement: -15,
        satisfactionTrend: 8,
        responseImprovement: -22
    },
    channelStats: [
        { name: 'Email', tickets: 456, satisfaction: 4.2, avgTime: 5.1 },
        { name: 'Chat', tickets: 324, satisfaction: 4.6, avgTime: 2.3 },
        { name: 'Phone', tickets: 198, satisfaction: 4.1, avgTime: 6.2 },
        { name: 'Social', tickets: 167, satisfaction: 3.9, avgTime: 8.1 },
        { name: 'Web', tickets: 102, satisfaction: 4.4, avgTime: 3.7 }
    ],
    agentPerformance: [
        { name: 'Ana García', ticketsResolved: 89, avgTime: 3.2, satisfaction: 4.8, status: 'excellent' },
        { name: 'Carlos Rodríguez', ticketsResolved: 76, avgTime: 4.1, satisfaction: 4.4, status: 'good' },
        { name: 'María López', ticketsResolved: 63, avgTime: 5.8, satisfaction: 4.0, status: 'good' },
        { name: 'Pedro Silva', ticketsResolved: 45, avgTime: 6.2, satisfaction: 3.7, status: 'needs-improvement' }
    ]
}

export type DateRange = '24h' | '7d' | '30d' | '90d'

export function useAnalytics() {
    const [dateRange, setDateRange] = useState<DateRange>('7d')
    const [data] = useState<AnalyticsData>(mockAnalyticsData)

    const performanceMetrics = useMemo(() => {
        const { performance, trends } = data

        return [
            {
                label: 'Total Tickets',
                value: performance.totalTickets.toLocaleString(),
                trend: trends.ticketsGrowth,
                icon: 'ticket'
            },
            {
                label: 'Avg Resolution Time',
                value: `${performance.avgResolutionTime}h`,
                trend: trends.resolutionImprovement,
                icon: 'clock'
            },
            {
                label: 'First Response Time',
                value: `${performance.firstResponseTime}h`,
                trend: trends.responseImprovement,
                icon: 'message'
            },
            {
                label: 'Satisfaction Score',
                value: performance.satisfactionScore.toFixed(1),
                trend: trends.satisfactionTrend,
                icon: 'star'
            }
        ]
    }, [data])

    const channelPerformance = useMemo(() => {
        return data.channelStats.map(channel => ({
            ...channel,
            efficiency: (channel.satisfaction * 5) / channel.avgTime,
            ticketPercentage: (channel.tickets / data.performance.totalTickets) * 100
        }))
    }, [data])

    const agentRankings = useMemo(() => {
        return [...data.agentPerformance].sort((a, b) => {
            const scoreA = (a.ticketsResolved * a.satisfaction) / a.avgTime
            const scoreB = (b.ticketsResolved * b.satisfaction) / b.avgTime
            return scoreB - scoreA
        })
    }, [data])

    const getTrendColor = (trend: number) => {
        if (trend > 0) return 'text-green-600'
        if (trend < 0) return 'text-red-600'
        return 'text-gray-600'
    }

    const getTrendIcon = (trend: number) => {
        if (trend > 0) return 'trending-up'
        if (trend < 0) return 'trending-down'
        return 'minus'
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'bg-green-100 text-green-800'
            case 'good': return 'bg-blue-100 text-blue-800'
            case 'needs-improvement': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return {
        data,
        dateRange,
        setDateRange,
        performanceMetrics,
        channelPerformance,
        agentRankings,
        getTrendColor,
        getTrendIcon,
        getStatusColor
    }
}