// lib/api.service.ts - Backward compatibility layer
// This file maintains compatibility with existing imports

// Re-export everything from the new API structure
export { apiService, ApiService } from './api'
export type { ApiResponse, LoginRequest, LoginResponse } from './api'

// Default export for compatibility
export { apiService as default } from './api'