// lib/api/index.ts - Main API service with backward compatibility

// Export all services
export { BaseApiService } from './base.service'
export { AuthService } from './auth.service'
export { HealthService } from './health.service'
export { UsersService, usersService } from './users.service'
export { AnalyticsService, analyticsService } from './analytics.service'
export { ChannelsService, channelsService } from './channels.service'

// Export types
export type { ApiResponse } from './base.service'
export type { LoginRequest, LoginResponse } from './auth.service'
export type { User, UserStats, CreateUserRequest, UpdateUserRequest } from './users.service'
export type { AnalyticsData, PerformanceMetrics, DateRange, ChannelStats as AnalyticsChannelStats } from './analytics.service'
export type { Channel, ChannelStats, CreateChannelRequest, UpdateChannelRequest } from './channels.service'

// Combined service for backward compatibility
import { AuthService } from './auth.service'
import { HealthService } from './health.service'
import { usersService } from './users.service'
import { analyticsService } from './analytics.service'
import { channelsService } from './channels.service'

export class ApiService extends AuthService {
  private healthService = new HealthService()

  // Feature services
  public users = usersService
  public analytics = analyticsService
  public channels = channelsService

  // Delegate health methods to health service
  async testConnection() {
    return this.healthService.testConnection()
  }

  async checkServerHealth() {
    return this.healthService.checkServerHealth()
  }
}

// Export singleton instance for backward compatibility
export const apiService = new ApiService()
export default apiService