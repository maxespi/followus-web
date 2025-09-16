// lib/api/base.service.ts
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export class BaseApiService {
  protected baseUrl: string

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
  }

  protected getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken') || localStorage.getItem('token')
  }

  protected setStoredToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('accessToken', token)
    localStorage.setItem('token', token) // Compatibility
  }

  protected removeStoredToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('accessToken')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
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
}