// lib/api/users.service.ts
import { BaseApiService, ApiResponse } from './base.service'

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'agent' | 'viewer'
    status: 'online' | 'offline' | 'away'
    lastSeen: string // ISO date string
    ticketsAssigned: number
    phone?: string
    joinDate: string // ISO date string
    avatar?: string
    permissions?: string[]
}

export interface UserStats {
    total: number
    online: number
    agents: number
    admins: number
    onlinePercentage: number
}

export interface CreateUserRequest {
    name: string
    email: string
    role: User['role']
    phone?: string
    permissions?: string[]
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
    status?: User['status']
}

export class UsersService extends BaseApiService {

    /**
     * Get all users with optional filtering
     */
    async getUsers(params?: {
        search?: string
        role?: User['role']
        status?: User['status']
        page?: number
        limit?: number
    }): Promise<ApiResponse<{ users: User[], total: number, stats: UserStats }>> {
        const searchParams = new URLSearchParams()

        if (params?.search) searchParams.append('search', params.search)
        if (params?.role) searchParams.append('role', params.role)
        if (params?.status) searchParams.append('status', params.status)
        if (params?.page) searchParams.append('page', params.page.toString())
        if (params?.limit) searchParams.append('limit', params.limit.toString())

        const query = searchParams.toString()
        const endpoint = `/users${query ? `?${query}` : ''}`

        const response = await this.makeRequest<{ users: User[], total: number, stats: UserStats }>(endpoint)

        // Fallback to mock data if API fails
        if (!response.success) {
            console.warn('🔄 Users API failed, using mock data:', response.error)
            return this.getMockUsers(params)
        }

        return response
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<ApiResponse<User>> {
        const response = await this.makeRequest<User>(`/users/${id}`)

        if (!response.success) {
            console.warn('🔄 User API failed, using mock data:', response.error)
            return this.getMockUser(id)
        }

        return response
    }

    /**
     * Create new user
     */
    async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
        return this.makeRequest<User>('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
    }

    /**
     * Update user
     */
    async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
        return this.makeRequest<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        })
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<ApiResponse<void>> {
        return this.makeRequest<void>(`/users/${id}`, {
            method: 'DELETE'
        })
    }

    /**
     * Update user status (online/offline/away)
     */
    async updateUserStatus(id: string, status: User['status']): Promise<ApiResponse<User>> {
        return this.makeRequest<User>(`/users/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        })
    }

    /**
     * Get user permissions
     */
    async getUserPermissions(id: string): Promise<ApiResponse<string[]>> {
        return this.makeRequest<string[]>(`/users/${id}/permissions`)
    }

    /**
     * Update user permissions
     */
    async updateUserPermissions(id: string, permissions: string[]): Promise<ApiResponse<void>> {
        return this.makeRequest<void>(`/users/${id}/permissions`, {
            method: 'PUT',
            body: JSON.stringify({ permissions })
        })
    }

    // Mock data fallbacks
    private getMockUsers(params?: {
        search?: string
        role?: User['role']
        status?: User['status']
    }): ApiResponse<{ users: User[], total: number, stats: UserStats }> {
        const mockUsers: User[] = [
            {
                id: 'user-1',
                name: 'Ana García',
                email: 'ana.garcia@example.com',
                role: 'admin',
                status: 'online',
                lastSeen: new Date().toISOString(),
                ticketsAssigned: 23,
                phone: '+56 9 8765 4321',
                joinDate: new Date('2023-01-15').toISOString()
            },
            {
                id: 'user-2',
                name: 'Carlos Rodríguez',
                email: 'carlos.rodriguez@example.com',
                role: 'agent',
                status: 'online',
                lastSeen: new Date().toISOString(),
                ticketsAssigned: 18,
                phone: '+56 9 8765 4322',
                joinDate: new Date('2023-02-20').toISOString()
            },
            {
                id: 'user-3',
                name: 'María López',
                email: 'maria.lopez@example.com',
                role: 'agent',
                status: 'away',
                lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                ticketsAssigned: 15,
                phone: '+56 9 8765 4323',
                joinDate: new Date('2023-03-10').toISOString()
            },
            {
                id: 'user-4',
                name: 'Pedro Martínez',
                email: 'pedro.martinez@example.com',
                role: 'viewer',
                status: 'offline',
                lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                ticketsAssigned: 0,
                phone: '+56 9 8765 4324',
                joinDate: new Date('2023-04-05').toISOString()
            }
        ]

        // Apply filters
        let filteredUsers = mockUsers

        if (params?.search) {
            const search = params.search.toLowerCase()
            filteredUsers = filteredUsers.filter(user =>
                user.name.toLowerCase().includes(search) ||
                user.email.toLowerCase().includes(search)
            )
        }

        if (params?.role) {
            filteredUsers = filteredUsers.filter(user => user.role === params.role)
        }

        if (params?.status) {
            filteredUsers = filteredUsers.filter(user => user.status === params.status)
        }

        // Calculate stats
        const total = mockUsers.length
        const online = mockUsers.filter(u => u.status === 'online').length
        const agents = mockUsers.filter(u => u.role === 'agent').length
        const admins = mockUsers.filter(u => u.role === 'admin').length

        const stats: UserStats = {
            total,
            online,
            agents,
            admins,
            onlinePercentage: Math.round((online / total) * 100)
        }

        return {
            success: true,
            data: {
                users: filteredUsers,
                total: filteredUsers.length,
                stats
            }
        }
    }

    private getMockUser(id: string): ApiResponse<User> {
        const mockUsersResponse = this.getMockUsers()
        const user = mockUsersResponse.data?.users.find(u => u.id === id)

        if (!user) {
            return {
                success: false,
                error: 'Usuario no encontrado'
            }
        }

        return {
            success: true,
            data: user
        }
    }
}

export const usersService = new UsersService()