// lib/api/analytics.service.ts
import { BaseApiService, ApiResponse } from './base.service'

export type DateRange = '24h' | '7d' | '30d' | '90d'

export interface PerformanceMetrics {
    totalTickets: number
    avgResolutionTime: number
    firstResponseTime: number
    satisfactionScore: number
    agentUtilization: number
}

export interface TrendData {
    ticketsGrowth: number
    resolutionImprovement: number
    satisfactionTrend: number
    responseImprovement: number
}

export interface ChannelStats {
    name: string
    tickets: number
    satisfaction: number
    avgTime: number
    efficiency?: number
    ticketPercentage?: number
}

export interface AgentPerformance {
    id: string
    name: string
    ticketsResolved: number
    avgTime: number
    satisfaction: number
    status: 'excellent' | 'good' | 'needs-improvement'
}

export interface AnalyticsData {
    performance: PerformanceMetrics
    trends: TrendData
    channelStats: ChannelStats[]
    agentPerformance: AgentPerformance[]
    timeSeriesData?: {
        date: string
        tickets: number
        satisfaction: number
        responseTime: number
    }[]
}

export interface AnalyticsFilters {
    dateRange: DateRange
    channels?: string[]
    agents?: string[]
    customDateFrom?: string
    customDateTo?: string
}

export class AnalyticsService extends BaseApiService {

    /**
     * Get analytics dashboard data
     */
    async getAnalyticsData(filters: AnalyticsFilters): Promise<ApiResponse<AnalyticsData>> {
        const searchParams = new URLSearchParams()
        searchParams.append('dateRange', filters.dateRange)

        if (filters.channels?.length) {
            searchParams.append('channels', filters.channels.join(','))
        }
        if (filters.agents?.length) {
            searchParams.append('agents', filters.agents.join(','))
        }
        if (filters.customDateFrom) {
            searchParams.append('from', filters.customDateFrom)
        }
        if (filters.customDateTo) {
            searchParams.append('to', filters.customDateTo)
        }

        const response = await this.makeRequest<AnalyticsData>(`/analytics?${searchParams.toString()}`)

        if (!response.success) {
            console.warn('🔄 Analytics API failed, using mock data:', response.error)
            return this.getMockAnalyticsData(filters)
        }

        return response
    }

    /**
     * Get performance metrics for a specific period
     */
    async getPerformanceMetrics(
        dateRange: DateRange,
        customFrom?: string,
        customTo?: string
    ): Promise<ApiResponse<PerformanceMetrics>> {
        const params = new URLSearchParams({ dateRange })
        if (customFrom) params.append('from', customFrom)
        if (customTo) params.append('to', customTo)

        const response = await this.makeRequest<PerformanceMetrics>(`/analytics/performance?${params.toString()}`)

        if (!response.success) {
            console.warn('🔄 Performance metrics API failed, using mock data:', response.error)
            return {
                success: true,
                data: this.getMockAnalyticsData({ dateRange }).data!.performance
            }
        }

        return response
    }

    /**
     * Get channel performance comparison
     */
    async getChannelPerformance(dateRange: DateRange): Promise<ApiResponse<ChannelStats[]>> {
        const response = await this.makeRequest<ChannelStats[]>(`/analytics/channels?dateRange=${dateRange}`)

        if (!response.success) {
            console.warn('🔄 Channel analytics API failed, using mock data:', response.error)
            return {
                success: true,
                data: this.getMockAnalyticsData({ dateRange }).data!.channelStats
            }
        }

        return response
    }

    /**
     * Get agent performance rankings
     */
    async getAgentPerformance(dateRange: DateRange): Promise<ApiResponse<AgentPerformance[]>> {
        const response = await this.makeRequest<AgentPerformance[]>(`/analytics/agents?dateRange=${dateRange}`)

        if (!response.success) {
            console.warn('🔄 Agent analytics API failed, using mock data:', response.error)
            return {
                success: true,
                data: this.getMockAnalyticsData({ dateRange }).data!.agentPerformance
            }
        }

        return response
    }

    /**
     * Get time series data for charts
     */
    async getTimeSeriesData(
        dateRange: DateRange,
        metrics: ('tickets' | 'satisfaction' | 'responseTime')[]
    ): Promise<ApiResponse<{ date: string, [key: string]: any }[]>> {
        const params = new URLSearchParams({ dateRange, metrics: metrics.join(',') })

        const response = await this.makeRequest<{ date: string, [key: string]: any }[]>(
            `/analytics/timeseries?${params.toString()}`
        )

        if (!response.success) {
            console.warn('🔄 Time series API failed, using mock data:', response.error)
            return this.getMockTimeSeriesData(dateRange, metrics)
        }

        return response
    }

    /**
     * Export analytics report
     */
    async exportReport(
        filters: AnalyticsFilters,
        format: 'csv' | 'pdf' | 'xlsx' = 'csv'
    ): Promise<ApiResponse<{ downloadUrl: string }>> {
        const params = new URLSearchParams({
            dateRange: filters.dateRange,
            format
        })

        if (filters.channels?.length) {
            params.append('channels', filters.channels.join(','))
        }

        return this.makeRequest<{ downloadUrl: string }>(`/analytics/export?${params.toString()}`)
    }

    // Mock data fallbacks
    private getMockAnalyticsData(filters: AnalyticsFilters): ApiResponse<AnalyticsData> {
        const mockData: AnalyticsData = {
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
            ].map(channel => ({
                ...channel,
                efficiency: (channel.satisfaction * 5) / channel.avgTime,
                ticketPercentage: (channel.tickets / 1247) * 100
            })),
            agentPerformance: [
                { id: 'agent-1', name: 'Ana García', ticketsResolved: 89, avgTime: 3.2, satisfaction: 4.8, status: 'excellent' as const },
                { id: 'agent-2', name: 'Carlos Rodríguez', ticketsResolved: 76, avgTime: 4.1, satisfaction: 4.4, status: 'good' as const },
                { id: 'agent-3', name: 'María López', ticketsResolved: 63, avgTime: 5.8, satisfaction: 4.0, status: 'good' as const },
                { id: 'agent-4', name: 'Pedro Silva', ticketsResolved: 45, avgTime: 6.2, satisfaction: 3.7, status: 'needs-improvement' as const }
            ].sort((a, b) => {
                const scoreA = (a.ticketsResolved * a.satisfaction) / a.avgTime
                const scoreB = (b.ticketsResolved * b.satisfaction) / b.avgTime
                return scoreB - scoreA
            })
        }

        return {
            success: true,
            data: mockData
        }
    }

    private getMockTimeSeriesData(
        dateRange: DateRange,
        metrics: string[]
    ): ApiResponse<{ date: string, [key: string]: any }[]> {
        const days = dateRange === '24h' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
        const data = Array.from({ length: days }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (days - 1 - i))

            return {
                date: date.toISOString().split('T')[0],
                tickets: Math.floor(Math.random() * 50) + 20,
                satisfaction: +(Math.random() * 2 + 3).toFixed(1),
                responseTime: +(Math.random() * 3 + 2).toFixed(1)
            }
        })

        return {
            success: true,
            data
        }
    }
}

export const analyticsService = new AnalyticsService()