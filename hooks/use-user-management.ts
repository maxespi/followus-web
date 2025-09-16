// hooks/use-user-management.ts
'use client'

import { useState, useMemo, useEffect } from 'react'
import { usersService, type User, type UserStats } from '@/lib/api'

export function useUserManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all')
    const [users, setUsers] = useState<User[]>([])
    const [userStats, setUserStats] = useState<UserStats>({
        total: 0,
        online: 0,
        agents: 0,
        admins: 0,
        onlinePercentage: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Convert date strings to Date objects for display
    const processUsers = (apiUsers: User[]): User[] => {
        return apiUsers.map(user => ({
            ...user,
            lastSeen: new Date(user.lastSeen),
            joinDate: new Date(user.joinDate)
        }))
    }

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await usersService.getUsers({
                    search: searchQuery || undefined,
                    role: roleFilter !== 'all' ? roleFilter : undefined
                })

                if (response.success && response.data) {
                    setUsers(processUsers(response.data.users))
                    setUserStats(response.data.stats)
                } else {
                    setError(response.error || 'Error loading users')
                }
            } catch (err) {
                setError('Error connecting to server')
                console.error('Error fetching users:', err)
            } finally {
                setIsLoading(false)
            }
        }

        // Debounce search requests
        const timeoutId = setTimeout(fetchUsers, searchQuery ? 300 : 0)
        return () => clearTimeout(timeoutId)
    }, [searchQuery, roleFilter])

    // Actions
    const createUser = async (userData: {
        name: string
        email: string
        role: User['role']
        phone?: string
    }) => {
        try {
            const response = await usersService.createUser(userData)
            if (response.success) {
                // Refresh users list
                const refreshResponse = await usersService.getUsers({
                    search: searchQuery || undefined,
                    role: roleFilter !== 'all' ? roleFilter : undefined
                })
                if (refreshResponse.success && refreshResponse.data) {
                    setUsers(processUsers(refreshResponse.data.users))
                    setUserStats(refreshResponse.data.stats)
                }
                return response
            }
            return response
        } catch (err) {
            console.error('Error creating user:', err)
            return { success: false, error: 'Error creating user' }
        }
    }

    const updateUser = async (id: string, userData: Partial<User>) => {
        try {
            const response = await usersService.updateUser(id, userData)
            if (response.success) {
                // Update local state
                setUsers(prev => prev.map(user =>
                    user.id === id ? { ...user, ...userData } : user
                ))
            }
            return response
        } catch (err) {
            console.error('Error updating user:', err)
            return { success: false, error: 'Error updating user' }
        }
    }

    const deleteUser = async (id: string) => {
        try {
            const response = await usersService.deleteUser(id)
            if (response.success) {
                // Remove from local state
                setUsers(prev => prev.filter(user => user.id !== id))
                // Update stats
                setUserStats(prev => ({
                    ...prev,
                    total: prev.total - 1
                }))
            }
            return response
        } catch (err) {
            console.error('Error deleting user:', err)
            return { success: false, error: 'Error deleting user' }
        }
    }

    const getRoleColor = (role: User['role']) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800'
            case 'agent': return 'bg-blue-100 text-blue-800'
            case 'viewer': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status: User['status']) => {
        switch (status) {
            case 'online': return 'bg-green-100 text-green-800'
            case 'away': return 'bg-yellow-100 text-yellow-800'
            case 'offline': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return {
        users,
        userStats,
        searchQuery,
        setSearchQuery,
        roleFilter,
        setRoleFilter,
        isLoading,
        error,
        createUser,
        updateUser,
        deleteUser,
        getRoleColor,
        getStatusColor
    }
}