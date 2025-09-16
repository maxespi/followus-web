// lib/api/health.service.ts
import { BaseApiService, ApiResponse } from './base.service'

export class HealthService extends BaseApiService {
  async testConnection(): Promise<ApiResponse> {
    // Try multiple endpoints to detect if server is up
    const endpoints = ['/health', '/status', '/ping', '/']

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying health check endpoint: ${endpoint}`)
        const response = await this.makeRequest(endpoint, {
          method: 'GET',
        })

        if (response.success) {
          console.log(`Health check successful on: ${endpoint}`)
          return response
        }
      } catch (error) {
        console.log(`Health check failed on ${endpoint}:`, error)
        continue
      }
    }

    // If all endpoints fail, return failure
    return {
      success: false,
      error: 'Ningún endpoint de salud responde'
    }
  }

  // Utility method to check if we're connected
  async checkServerHealth(): Promise<boolean> {
    try {
      console.log('Testing server connectivity to:', this.baseUrl)

      // Method 1: Try health endpoints (most reliable if CORS is configured)
      try {
        const response = await this.testConnection()
        if (response.success) {
          console.log('Health endpoint check: SUCCESS')
          return true
        }
      } catch (healthError) {
        console.log('Health endpoints failed:', healthError)

        // If it's a CORS error, the server is probably up but not configured
        if (healthError instanceof Error &&
            (healthError.message.includes('CORS') ||
             healthError.message.includes('cross-origin'))) {
          console.log('CORS error detected - server is likely up but CORS not configured')
          return true // Server is up, just needs CORS config
        }
      }

      // Method 2: Try a simple request to any API endpoint
      try {
        const response = await fetch(this.baseUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        })

        console.log(`GET request to ${this.baseUrl} status:`, response.status)

        // If we get any response (even errors), the server is up
        if (response.status !== undefined) {
          return true
        }
      } catch (apiError) {
        console.log('Basic API request failed:', apiError)

        // Check if it's CORS related
        if (apiError instanceof Error &&
            (apiError.message.includes('CORS') ||
             apiError.message.includes('cross-origin'))) {
          console.log('CORS error on API request - server is up but needs CORS configuration')
          return true
        }
      }

      // Method 3: Try base server (without /api)
      try {
        const baseUrl = this.baseUrl.replace('/api', '')
        const response = await fetch(baseUrl, {
          method: 'HEAD',
          mode: 'no-cors', // This will avoid CORS errors but give limited info
          signal: AbortSignal.timeout(3000)
        })

        console.log(`no-cors HEAD request to ${baseUrl} completed - server is likely up`)
        return true // If no-cors request completes, server is probably up
      } catch (headError) {
        console.log('no-cors HEAD request failed:', headError)
      }

      console.log('All connectivity tests failed - server appears to be down')
      return false
    } catch (error) {
      console.error('Server health check failed:', error)
      return false
    }
  }
}