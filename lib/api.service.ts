// lib/api.service.ts
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  message: string
  data: {
    id: number
    nombre: string
    apellido: string
    email: string
    rasgosDistintivos: string
    dispositivos: any[]
    atribucionDeUsuario: any[]
    atribucionDeGrupos: any[]
    token: string
    nivelAcceso: string
    empresas: Array<{
      id: number
      nombre: string
    }>
    solicitarCambioPassword: boolean
    fechaCambioPassword: string
  }
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ApiService {
  private baseUrl: string

  constructor() {
    // Check if we should use development IP
    const useDevIp = process.env.NEXT_PUBLIC_USE_DEV_IP === 'true'
    const devUrl = process.env.NEXT_PUBLIC_API_DEV_IP
    const defaultUrl = process.env.NEXT_PUBLIC_API_URL

    if (process.env.NODE_ENV === 'development' && useDevIp && devUrl) {
      this.baseUrl = devUrl
    } else {
      this.baseUrl = defaultUrl || 'https://localhost/api'
    }

    // API Service initialized with URL: ${this.baseUrl}
  }

  async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    }

    // Add authorization header if token exists
    const token = this.getStoredToken()
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const config: RequestInit = {
      ...options,
      headers: defaultHeaders,
    }

    try {
      const response = await fetch(url, config)

      // Handle different response types
      let data: any
      const contentType = response.headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        // Handle specific HTTP error codes
        let errorMessage = 'Error desconocido'

        if (response.status === 401) {
          errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.'
        } else if (response.status === 403) {
          errorMessage = 'Acceso denegado. No tienes permisos para realizar esta acción.'
        } else if (response.status === 404) {
          errorMessage = 'Servicio no encontrado. Verifica la configuración del servidor.'
        } else if (response.status === 500) {
          errorMessage = 'Error interno del servidor. Contacta al administrador.'
        } else if (data && typeof data === 'object') {
          errorMessage = data.message || data.error || `Error HTTP ${response.status}`
        } else if (typeof data === 'string') {
          errorMessage = data
        }

        return {
          success: false,
          error: errorMessage
        }
      }

      // Normalize response format
      if (typeof data === 'object' && data !== null) {
        return data as ApiResponse<T>
      } else {
        return {
          success: true,
          data: data as T
        }
      }
    } catch (error) {
      // Solo log de errores críticos
      if (endpoint.includes('/tasks/')) {
        console.error('❌ API Request failed:', error)
      }

      // Handle specific error types
      if (error instanceof TypeError) {
        if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
          return {
            success: false,
            error: 'Error CORS: El servidor backend necesita configurar las cabeceras CORS para permitir requests desde este dominio.'
          }
        }
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          return {
            success: false,
            error: 'No se puede conectar con el servidor. Verifica que el backend esté funcionando y sea accesible.'
          }
        }
        if (error.message.includes('NetworkError') || error.message.includes('network')) {
          return {
            success: false,
            error: 'Error de red. Verifica tu conexión a internet y la URL del servidor.'
          }
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido de conexión'
      }
    }
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken') || localStorage.getItem('token')
  }

  private setStoredToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('accessToken', token)
    localStorage.setItem('token', token) // Compatibility
  }

  private removeStoredToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('accessToken')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse['data']>> {
    const response = await this.makeRequest<LoginResponse>('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        from: 'web' // Especificar que viene del web frontend
      }),
    })

    // Handle the response structure from backend
    if (response.success && response.data) {
      const userData = response.data

      // Store token
      if (userData.token) {
        this.setStoredToken(userData.token)
      }

      // Return the user data in the correct format
      return {
        success: true,
        data: userData,
        message: response.message || 'Login exitoso'
      }
    } else {
      // Handle error cases from backend documentation
      let errorMessage = response.error || 'Error de autenticación'

      // Map specific error messages based on HTTP status or content
      if (response.error) {
        if (response.error.includes('404') || response.error.includes('Usuario no existe')) {
          errorMessage = 'El usuario no existe en el sistema'
        } else if (response.error.includes('403') || response.error.includes('confirmado') || response.error.includes('contraseña incorrecta')) {
          errorMessage = 'Credenciales incorrectas o usuario no confirmado'
        } else if (response.error.includes('400') || response.error.includes('dispositivo')) {
          errorMessage = 'Usuario sin dispositivo vinculado'
        }
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest('/auth/logout', {
      method: 'POST',
    })

    // Always clear local storage regardless of server response
    this.removeStoredToken()

    return response
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.makeRequest('/usuarios/perfil')
  }

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

// Export singleton instance
export const apiService = new ApiService()
export default apiService
