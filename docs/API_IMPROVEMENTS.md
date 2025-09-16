# API Improvements Documentation

Este documento detalla las mejoras necesarias en la API del backend para dar soporte completo a las funcionalidades implementadas en el frontend.

## 🎯 Resumen Ejecutivo

La aplicación FollowUS ha sido refactorizada para usar una arquitectura modular con servicios API especializados. Se requiere implementar endpoints REST que proporcionen datos reales para reemplazar los fallbacks mock actuales.

## 📊 Estado Actual

- ✅ **Frontend**: Completamente implementado con fallbacks a datos mock
- ✅ **Servicios API**: Implementados con patrón resiliente (API real → fallback mock)
- ⚠️ **Backend**: Requiere implementación de endpoints documentados

## 🔧 Servicios API Implementados

### 1. Users Service (`/api/users`)

**Endpoints requeridos:**

```typescript
GET    /api/users                    // Lista usuarios con filtros
GET    /api/users/:id                // Usuario específico
POST   /api/users                    // Crear usuario
PUT    /api/users/:id                // Actualizar usuario
DELETE /api/users/:id                // Eliminar usuario
PATCH  /api/users/:id/status         // Actualizar estado online/offline
GET    /api/users/:id/permissions    // Obtener permisos
PUT    /api/users/:id/permissions    // Actualizar permisos
```

**Parámetros de consulta soportados:**
- `search`: Búsqueda por nombre o email
- `role`: Filtro por rol (admin|agent|viewer)
- `status`: Filtro por estado (online|offline|away)
- `page`, `limit`: Paginación

**Estructura de respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "admin|agent|viewer",
        "status": "online|offline|away",
        "lastSeen": "ISO-date",
        "ticketsAssigned": "number",
        "phone": "string?",
        "joinDate": "ISO-date",
        "avatar": "string?",
        "permissions": ["string"]
      }
    ],
    "total": "number",
    "stats": {
      "total": "number",
      "online": "number",
      "agents": "number",
      "admins": "number",
      "onlinePercentage": "number"
    }
  }
}
```

### 2. Analytics Service (`/api/analytics`)

**Endpoints requeridos:**

```typescript
GET /api/analytics                     // Dashboard completo
GET /api/analytics/performance         // Métricas de rendimiento
GET /api/analytics/channels            // Performance por canal
GET /api/analytics/agents              // Rankings de agentes
GET /api/analytics/timeseries          // Datos para gráficos
GET /api/analytics/export              // Exportar reportes
```

**Parámetros soportados:**
- `dateRange`: 24h|7d|30d|90d
- `channels`: Lista de IDs de canales
- `agents`: Lista de IDs de agentes
- `from`, `to`: Fechas customizadas
- `format`: csv|pdf|xlsx (para export)

**Estructura de métricas:**
```json
{
  "success": true,
  "data": {
    "performance": {
      "totalTickets": "number",
      "avgResolutionTime": "number (hours)",
      "firstResponseTime": "number (hours)",
      "satisfactionScore": "number (1-5)",
      "agentUtilization": "number (percentage)"
    },
    "trends": {
      "ticketsGrowth": "number (percentage)",
      "resolutionImprovement": "number (percentage)",
      "satisfactionTrend": "number (percentage)",
      "responseImprovement": "number (percentage)"
    },
    "channelStats": [
      {
        "name": "string",
        "tickets": "number",
        "satisfaction": "number",
        "avgTime": "number"
      }
    ],
    "agentPerformance": [
      {
        "id": "string",
        "name": "string",
        "ticketsResolved": "number",
        "avgTime": "number",
        "satisfaction": "number",
        "status": "excellent|good|needs-improvement"
      }
    ]
  }
}
```

### 3. Channels Service (`/api/channels`)

**Endpoints requeridos:**

```typescript
GET    /api/channels                    // Lista canales
GET    /api/channels/:id                // Canal específico
POST   /api/channels                    // Crear canal
PUT    /api/channels/:id                // Actualizar canal
DELETE /api/channels/:id                // Eliminar canal
PATCH  /api/channels/:id/status         // Cambiar estado
PATCH  /api/channels/:id/config         // Actualizar configuración
GET    /api/channels/:id/test           // Probar conexión
GET    /api/channels/:id/metrics        // Métricas del canal
POST   /api/channels/:id/sync           // Sincronizar datos
GET    /api/channels/types              // Tipos disponibles
```

**Configuración por tipo de canal:**
```json
{
  "email": {
    "configFields": [
      {"key": "server", "label": "Servidor IMAP", "type": "text", "required": true},
      {"key": "username", "label": "Usuario", "type": "text", "required": true},
      {"key": "password", "label": "Contraseña", "type": "password", "required": true},
      {"key": "port", "label": "Puerto", "type": "number", "required": false}
    ]
  },
  "chat": {
    "configFields": [
      {"key": "widgetId", "label": "ID del Widget", "type": "text", "required": true},
      {"key": "domain", "label": "Dominio autorizado", "type": "url", "required": true}
    ]
  }
}
```

### 4. Knowledge Base Service (`/api/knowledge`)

**Endpoints pendientes de implementar:**

```typescript
GET    /api/knowledge/articles          // Lista artículos
GET    /api/knowledge/articles/:id      // Artículo específico
POST   /api/knowledge/articles          // Crear artículo
PUT    /api/knowledge/articles/:id      // Actualizar artículo
DELETE /api/knowledge/articles/:id      // Eliminar artículo
GET    /api/knowledge/categories        // Lista categorías
POST   /api/knowledge/articles/:id/helpful  // Marcar como útil
GET    /api/knowledge/search            // Búsqueda avanzada
```

### 5. Security Service (`/api/security`)

**Endpoints pendientes de implementar:**

```typescript
GET    /api/security/events             // Eventos de seguridad
GET    /api/security/policies           // Políticas de seguridad
PUT    /api/security/policies/:id       // Actualizar política
GET    /api/security/audit-log          // Log de auditoría
POST   /api/security/events/:id/resolve // Resolver evento
```

## 🚀 Beneficios de la Implementación

### ✅ Ya Implementado (Frontend)

1. **Patrón Resiliente**: Fallback automático a datos mock si API falla
2. **Arquitectura Modular**: Servicios especializados por feature
3. **Manejo de Errores**: Mensajes específicos por tipo de error
4. **Optimización**: Debouncing en búsquedas, caching de resultados
5. **TypeScript Completo**: Tipado estricto para todas las interfaces
6. **Hooks Personalizados**: Lógica de negocio encapsulada y reutilizable

### 🎯 Beneficios al Implementar Backend

1. **Datos Reales**: Reemplazo de datos mock con información actual
2. **Sincronización**: Estados en tiempo real entre usuarios
3. **Escalabilidad**: Arquitectura preparada para crecimiento
4. **Seguridad**: Autenticación y autorización robusta
5. **Analytics**: Métricas y reportes basados en datos reales
6. **Integraciones**: Conectividad con sistemas externos

## 🔧 Configuración Requerida

### Variables de Entorno

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://api.followus.com/api
NEXT_PUBLIC_API_DEV_IP=https://192.168.1.100/api
NEXT_PUBLIC_USE_DEV_IP=false

# Database Configuration (Backend)
DATABASE_URL=postgresql://user:pass@localhost:5432/followus
REDIS_URL=redis://localhost:6379

# Authentication (Backend)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# External Integrations (Backend)
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@followus.com
SMTP_PASS=app-password
```

### Headers Requeridos

```typescript
// Todos los requests incluyen:
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <jwt-token>' // Si autenticado
}
```

### Códigos de Error Estándar

```typescript
// El frontend maneja estos códigos automáticamente:
200: 'Éxito'
400: 'Datos inválidos'
401: 'Credenciales inválidas'
403: 'Acceso denegado'
404: 'Recurso no encontrado'
429: 'Límite de requests excedido'
500: 'Error interno del servidor'
```

## 📝 Formato de Respuesta Estándar

```typescript
// Respuesta exitosa
interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

// Respuesta con error
interface ApiErrorResponse {
  success: false
  error: string
  code?: number
  details?: any
}
```

## 🔄 Estrategia de Migración

### Fase 1: Servicios Core ✅ (Completado)
- ✅ Users Service
- ✅ Analytics Service
- ✅ Channels Service
- ✅ Base API infrastructure

### Fase 2: Servicios Secundarios (Pendiente)
- ⏳ Knowledge Base Service
- ⏳ Security Service
- ⏳ Settings Service

### Fase 3: Funcionalidades Avanzadas (Pendiente)
- ⏳ Real-time notifications (WebSockets)
- ⏳ File upload/management
- ⏳ Advanced reporting
- ⏳ Email templates

## 🧪 Testing

### Endpoints de Prueba

```bash
# Health check
curl -X GET "${API_URL}/health"

# Test authentication
curl -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'

# Test users endpoint
curl -X GET "${API_URL}/users" \
  -H "Authorization: Bearer <token>"
```

### Mock Data Validation

Todos los servicios incluyen datos mock que representan la estructura exacta esperada del backend, facilitando el desarrollo paralelo y testing.

## 📞 Contacto Técnico

Para consultas sobre implementación:
- **Frontend Lead**: Documentación completa en código fuente
- **API Documentation**: Ver `/lib/api/*.service.ts` para interfaces exactas
- **Test Environment**: Configurar `.env.local` con endpoints de desarrollo

---

**Nota**: Esta documentación se mantiene sincronizada con el código fuente. Cualquier cambio en interfaces debe reflejarse aquí.