// lib/api/channels.service.ts
import { BaseApiService, ApiResponse } from './base.service'

export interface Channel {
    id: string
    name: string
    type: 'email' | 'chat' | 'phone' | 'social' | 'web'
    status: 'active' | 'inactive' | 'maintenance'
    connectedSince: string // ISO date string
    totalTickets: number
    activeTickets: number
    avgResponseTime: number
    satisfactionScore: number
    configuration: {
        autoAssign: boolean
        priority: 'low' | 'medium' | 'high'
        businessHours: boolean
        notifications: boolean
        webhookUrl?: string
        apiKey?: string
        settings?: Record<string, any>
    }
    integrationData?: {
        lastSync?: string
        syncStatus: 'connected' | 'disconnected' | 'error'
        errorMessage?: string
    }
}

export interface ChannelStats {
    total: number
    active: number
    totalTickets: number
    totalActiveTickets: number
    avgSatisfaction: number
    activePercentage: number
}

export interface CreateChannelRequest {
    name: string
    type: Channel['type']
    configuration: Channel['configuration']
    integrationData?: Partial<Channel['integrationData']>
}

export interface UpdateChannelRequest extends Partial<CreateChannelRequest> {
    status?: Channel['status']
}

export class ChannelsService extends BaseApiService {

    /**
     * Get all channels
     */
    async getChannels(filters?: {
        type?: Channel['type']
        status?: Channel['status']
        includeStats?: boolean
    }): Promise<ApiResponse<{ channels: Channel[], stats: ChannelStats }>> {
        const params = new URLSearchParams()
        if (filters?.type) params.append('type', filters.type)
        if (filters?.status) params.append('status', filters.status)
        if (filters?.includeStats) params.append('includeStats', 'true')

        const query = params.toString()
        const endpoint = `/channels${query ? `?${query}` : ''}`

        const response = await this.makeRequest<{ channels: Channel[], stats: ChannelStats }>(endpoint)

        if (!response.success) {
            console.warn('🔄 Channels API failed, using mock data:', response.error)
            return this.getMockChannels(filters)
        }

        return response
    }

    /**
     * Get channel by ID
     */
    async getChannelById(id: string): Promise<ApiResponse<Channel>> {
        const response = await this.makeRequest<Channel>(`/channels/${id}`)

        if (!response.success) {
            console.warn('🔄 Channel API failed, using mock data:', response.error)
            return this.getMockChannel(id)
        }

        return response
    }

    /**
     * Create new channel
     */
    async createChannel(channelData: CreateChannelRequest): Promise<ApiResponse<Channel>> {
        return this.makeRequest<Channel>('/channels', {
            method: 'POST',
            body: JSON.stringify(channelData)
        })
    }

    /**
     * Update channel
     */
    async updateChannel(id: string, channelData: UpdateChannelRequest): Promise<ApiResponse<Channel>> {
        return this.makeRequest<Channel>(`/channels/${id}`, {
            method: 'PUT',
            body: JSON.stringify(channelData)
        })
    }

    /**
     * Update channel status
     */
    async updateChannelStatus(id: string, status: Channel['status']): Promise<ApiResponse<Channel>> {
        return this.makeRequest<Channel>(`/channels/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        })
    }

    /**
     * Update channel configuration
     */
    async updateChannelConfig(
        id: string,
        config: Partial<Channel['configuration']>
    ): Promise<ApiResponse<Channel>> {
        return this.makeRequest<Channel>(`/channels/${id}/config`, {
            method: 'PATCH',
            body: JSON.stringify(config)
        })
    }

    /**
     * Test channel connection
     */
    async testChannelConnection(id: string): Promise<ApiResponse<{
        connected: boolean
        latency?: number
        lastTest: string
        error?: string
    }>> {
        return this.makeRequest<{
            connected: boolean
            latency?: number
            lastTest: string
            error?: string
        }>(`/channels/${id}/test`)
    }

    /**
     * Get channel metrics
     */
    async getChannelMetrics(
        id: string,
        dateRange: '24h' | '7d' | '30d' = '7d'
    ): Promise<ApiResponse<{
        tickets: { date: string, count: number }[]
        responseTime: { date: string, avgTime: number }[]
        satisfaction: { date: string, score: number }[]
    }>> {
        return this.makeRequest<{
            tickets: { date: string, count: number }[]
            responseTime: { date: string, avgTime: number }[]
            satisfaction: { date: string, score: number }[]
        }>(`/channels/${id}/metrics?dateRange=${dateRange}`)
    }

    /**
     * Sync channel data
     */
    async syncChannel(id: string): Promise<ApiResponse<{
        syncedAt: string
        ticketsImported: number
        status: 'success' | 'partial' | 'failed'
        errors?: string[]
    }>> {
        return this.makeRequest<{
            syncedAt: string
            ticketsImported: number
            status: 'success' | 'partial' | 'failed'
            errors?: string[]
        }>(`/channels/${id}/sync`, {
            method: 'POST'
        })
    }

    /**
     * Delete channel
     */
    async deleteChannel(id: string): Promise<ApiResponse<void>> {
        return this.makeRequest<void>(`/channels/${id}`, {
            method: 'DELETE'
        })
    }

    /**
     * Get available channel types and their requirements
     */
    async getChannelTypes(): Promise<ApiResponse<{
        type: Channel['type']
        name: string
        description: string
        configFields: {
            key: string
            label: string
            type: 'text' | 'password' | 'url' | 'boolean'
            required: boolean
            description?: string
        }[]
    }[]>> {
        const response = await this.makeRequest<any>('/channels/types')

        if (!response.success) {
            return {
                success: true,
                data: [
                    {
                        type: 'email' as const,
                        name: 'Email',
                        description: 'Integración con servidores de email IMAP/SMTP',
                        configFields: [
                            { key: 'server', label: 'Servidor IMAP', type: 'text', required: true },
                            { key: 'username', label: 'Usuario', type: 'text', required: true },
                            { key: 'password', label: 'Contraseña', type: 'password', required: true }
                        ]
                    },
                    {
                        type: 'chat' as const,
                        name: 'Chat en Vivo',
                        description: 'Widget de chat para sitios web',
                        configFields: [
                            { key: 'widgetId', label: 'ID del Widget', type: 'text', required: true },
                            { key: 'domain', label: 'Dominio autorizado', type: 'url', required: true }
                        ]
                    }
                ]
            }
        }

        return response
    }

    // Mock data fallbacks
    private getMockChannels(filters?: {
        type?: Channel['type']
        status?: Channel['status']
    }): ApiResponse<{ channels: Channel[], stats: ChannelStats }> {
        const mockChannels: Channel[] = [
            {
                id: 'channel-1',
                name: 'Email Support',
                type: 'email',
                status: 'active',
                connectedSince: new Date('2023-01-01').toISOString(),
                totalTickets: 456,
                activeTickets: 23,
                avgResponseTime: 5.1,
                satisfactionScore: 4.2,
                configuration: {
                    autoAssign: true,
                    priority: 'medium',
                    businessHours: true,
                    notifications: true
                },
                integrationData: {
                    lastSync: new Date().toISOString(),
                    syncStatus: 'connected'
                }
            },
            {
                id: 'channel-2',
                name: 'Live Chat',
                type: 'chat',
                status: 'active',
                connectedSince: new Date('2023-01-15').toISOString(),
                totalTickets: 324,
                activeTickets: 8,
                avgResponseTime: 2.3,
                satisfactionScore: 4.6,
                configuration: {
                    autoAssign: true,
                    priority: 'high',
                    businessHours: false,
                    notifications: true
                },
                integrationData: {
                    lastSync: new Date().toISOString(),
                    syncStatus: 'connected'
                }
            },
            {
                id: 'channel-3',
                name: 'Phone Support',
                type: 'phone',
                status: 'active',
                connectedSince: new Date('2023-02-01').toISOString(),
                totalTickets: 198,
                activeTickets: 12,
                avgResponseTime: 6.2,
                satisfactionScore: 4.1,
                configuration: {
                    autoAssign: false,
                    priority: 'high',
                    businessHours: true,
                    notifications: true
                },
                integrationData: {
                    lastSync: new Date(Date.now() - 60000).toISOString(),
                    syncStatus: 'connected'
                }
            },
            {
                id: 'channel-4',
                name: 'Social Media',
                type: 'social',
                status: 'maintenance',
                connectedSince: new Date('2023-03-01').toISOString(),
                totalTickets: 167,
                activeTickets: 5,
                avgResponseTime: 8.1,
                satisfactionScore: 3.9,
                configuration: {
                    autoAssign: true,
                    priority: 'medium',
                    businessHours: true,
                    notifications: false
                },
                integrationData: {
                    lastSync: new Date(Date.now() - 3600000).toISOString(),
                    syncStatus: 'error',
                    errorMessage: 'API rate limit exceeded'
                }
            },
            {
                id: 'channel-5',
                name: 'Web Portal',
                type: 'web',
                status: 'inactive',
                connectedSince: new Date('2023-04-01').toISOString(),
                totalTickets: 102,
                activeTickets: 0,
                avgResponseTime: 3.7,
                satisfactionScore: 4.4,
                configuration: {
                    autoAssign: true,
                    priority: 'low',
                    businessHours: false,
                    notifications: true
                },
                integrationData: {
                    lastSync: new Date(Date.now() - 86400000).toISOString(),
                    syncStatus: 'disconnected'
                }
            }
        ]

        // Apply filters
        let filteredChannels = mockChannels

        if (filters?.type) {
            filteredChannels = filteredChannels.filter(channel => channel.type === filters.type)
        }

        if (filters?.status) {
            filteredChannels = filteredChannels.filter(channel => channel.status === filters.status)
        }

        // Calculate stats
        const total = mockChannels.length
        const active = mockChannels.filter(c => c.status === 'active').length
        const totalTickets = mockChannels.reduce((sum, c) => sum + c.totalTickets, 0)
        const totalActiveTickets = mockChannels.reduce((sum, c) => sum + c.activeTickets, 0)
        const avgSatisfaction = mockChannels.reduce((sum, c) => sum + c.satisfactionScore, 0) / total

        const stats: ChannelStats = {
            total,
            active,
            totalTickets,
            totalActiveTickets,
            avgSatisfaction: Number(avgSatisfaction.toFixed(1)),
            activePercentage: Math.round((active / total) * 100)
        }

        return {
            success: true,
            data: {
                channels: filteredChannels,
                stats
            }
        }
    }

    private getMockChannel(id: string): ApiResponse<Channel> {
        const mockChannelsResponse = this.getMockChannels()
        const channel = mockChannelsResponse.data?.channels.find(c => c.id === id)

        if (!channel) {
            return {
                success: false,
                error: 'Canal no encontrado'
            }
        }

        return {
            success: true,
            data: channel
        }
    }
}

export const channelsService = new ChannelsService()