// lib/api/auth.service.ts
import { BaseApiService, ApiResponse } from './base.service'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
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

export class AuthService extends BaseApiService {
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
}