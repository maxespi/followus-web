# BACKEND.md - Followus Backend Development Guide

Documentación para desarrollar el backend de la aplicación followus-web usando PostgreSQL, Prisma y arquitectura modular multitenant.

## 🏗️ Arquitectura General

### Stack Tecnológico
- **Node.js** con TypeScript
- **PostgreSQL** como base de datos principal
- **Prisma** como ORM
- **Express.js** o **Fastify** como framework web
- **JWT** para autenticación
- **Redis** para cache y sesiones
- **Docker** para containerización

### Estructura de Proyecto
```
followus-backend/
├── src/
│   ├── core/                 # Módulos base del sistema
│   │   ├── auth/            # Autenticación y autorización
│   │   ├── tenant/          # Gestión multitenant
│   │   └── database/        # Configuración DB y Prisma
│   ├── modules/             # Módulos de negocio
│   │   ├── users/           # Gestión de usuarios
│   │   ├── tickets/         # Sistema de tickets
│   │   ├── knowledge/       # Base de conocimientos
│   │   ├── channels/        # Canales de comunicación
│   │   └── analytics/       # Análisis y métricas
│   ├── shared/              # Utilidades compartidas
│   │   ├── types/           # Tipos TypeScript
│   │   ├── utils/           # Funciones auxiliares
│   │   └── middleware/      # Middlewares Express
│   └── app.ts               # Punto de entrada
├── prisma/
│   ├── schema.prisma        # Esquema de BD
│   ├── migrations/          # Migraciones
│   └── seeds/               # Datos iniciales
├── tests/                   # Pruebas unitarias e integración
└── docs/                    # Documentación adicional
```

## 🏢 Arquitectura Multitenant

### Estrategia: Schema per Tenant
Cada tenant tiene su propio esquema en PostgreSQL para máximo aislamiento de datos.

#### Modelo de Tenant
```typescript
// Schema Prisma base
model Tenant {
  id          String    @id @default(cuid())
  name        String
  subdomain   String    @unique
  schema_name String    @unique
  status      TenantStatus @default(ACTIVE)
  settings    Json?
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  // Relaciones
  users       User[]

  @@map("tenants")
}

enum TenantStatus {
  ACTIVE
  SUSPENDED
  INACTIVE
}
```

#### Middleware de Tenant
```typescript
// src/core/tenant/tenant.middleware.ts
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subdomain = extractSubdomain(req.hostname)
    const tenant = await getTenantBySubdomain(subdomain)

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' })
    }

    // Configurar Prisma para usar el schema del tenant
    req.tenant = tenant
    req.prisma = getPrismaForTenant(tenant.schema_name)

    next()
  } catch (error) {
    next(error)
  }
}
```

## 👥 Sistema de Usuarios

### Roles y Permisos
```typescript
enum UserRole {
  SUPER_ADMIN    // Administra múltiples tenants
  TENANT_ADMIN   // Administra un tenant específico
  AGENT          // Agente de soporte
  CUSTOMER       // Cliente final
}

model User {
  id           String     @id @default(cuid())
  email        String     @unique
  password     String
  name         String
  role         UserRole   @default(CUSTOMER)
  status       UserStatus @default(ACTIVE)
  avatar_url   String?
  phone        String?

  // Metadatos
  last_login   DateTime?
  created_at   DateTime   @default(now())
  updated_at   DateTime   @updatedAt

  // Relaciones
  tenant_id    String
  tenant       Tenant     @relation(fields: [tenant_id], references: [id])

  // Tickets
  assigned_tickets  Ticket[] @relation("AssignedAgent")
  created_tickets   Ticket[] @relation("CustomerTickets")

  // Actividad
  activities   Activity[]

  @@map("users")
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

### Autenticación JWT
```typescript
// src/core/auth/auth.service.ts
interface JWTPayload {
  userId: string
  tenantId: string
  role: UserRole
  email: string
}

export class AuthService {
  async login(email: string, password: string, tenantId: string) {
    const user = await this.validateUser(email, password, tenantId)
    const tokens = await this.generateTokens(user)

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  }

  async generateTokens(user: User) {
    const payload: JWTPayload = {
      userId: user.id,
      tenantId: user.tenant_id,
      role: user.role,
      email: user.email
    }

    return {
      accessToken: jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }),
      refreshToken: jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
    }
  }
}
```

### API Endpoints de Autenticación
```typescript
// src/core/auth/auth.controller.ts
export class AuthController {

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Headers('x-tenant-id') tenantId: string) {
    const { email, password } = loginDto

    try {
      const result = await this.authService.login(email, password, tenantId)

      return {
        success: true,
        data: result,
        message: 'Login exitoso'
      }
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas')
    }
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@User() user: UserEntity) {
    await this.authService.logout(user.id)

    return {
      success: true,
      message: 'Logout exitoso'
    }
  }

  @Post('/refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    const { refreshToken } = refreshDto

    try {
      const result = await this.authService.refreshToken(refreshToken)

      return {
        success: true,
        data: result
      }
    } catch (error) {
      throw new UnauthorizedException('Token de refresh inválido')
    }
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@User() user: UserEntity) {
    return {
      success: true,
      data: this.authService.sanitizeUser(user)
    }
  }
}

interface LoginDto {
  email: string
  password: string
}

interface RefreshTokenDto {
  refreshToken: string
}
```

### Health Check Endpoints
```typescript
// src/core/health/health.controller.ts
export class HealthController {

  @Get('/health')
  async getHealth() {
    try {
      // Verificar conexiones de dependencias
      const dbStatus = await this.checkDatabaseHealth()
      const redisStatus = await this.checkRedisHealth()

      return {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          service: 'followus-backend',
          version: process.env.APP_VERSION || '1.0.0',
          environment: process.env.NODE_ENV,
          dependencies: {
            database: dbStatus,
            redis: redisStatus
          }
        },
        message: 'Todos los servicios funcionando correctamente'
      }
    } catch (error) {
      return {
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          service: 'followus-backend'
        },
        error: 'Error en verificación de salud'
      }
    }
  }

  @Get('/status')
  async getStatus() {
    return { status: 'ok' }
  }

  @Get('/ping')
  async ping() {
    return 'pong'
  }

  private async checkDatabaseHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return { status: 'connected' }
    } catch (error) {
      return { status: 'disconnected', error: error.message }
    }
  }

  private async checkRedisHealth() {
    try {
      await this.redisClient.ping()
      return { status: 'connected' }
    } catch (error) {
      return { status: 'disconnected', error: error.message }
    }
  }
}
```

### CORS Configuration
```typescript
// src/core/cors/cors.config.ts
import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5164',     // Frontend desarrollo (puerto actualizado)
      'https://localhost:5164',    // Frontend desarrollo SSL
      'https://hades.cl',          // Producción
      'https://www.hades.cl',      // Producción con www
    ]

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}

// src/app.ts - Express setup
import cors from 'cors'
import { corsConfig } from './core/cors/cors.config'

app.use(cors(corsConfig))

// Middleware para manejar preflight requests
app.options('*', cors(corsConfig))
```

## 🔗 Integración con Frontend

### Estado de Autenticación Frontend
La aplicación Next.js incluye un sistema de autenticación completo con las siguientes características:

#### AppContext (Estado Global)
```typescript
// context/AppContext.tsx - Estado de autenticación
interface AppState {
  theme: ThemeMode
  language: Language
  sidebarCollapsed: boolean
  isAuthenticated: boolean  // Estado de autenticación
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
}

// Acciones disponibles
export type AppAction =
  | { type: 'LOGIN'; payload: AppState['user'] }    // Acción de login
  | { type: 'LOGOUT' }                              // Acción de logout
  | { type: 'SET_USER'; payload: AppState['user'] }
  // ... otras acciones
```

#### Página de Login
- **Ruta**: `/login`
- **Funcionalidad**:
  - Formulario de email/contraseña
  - Demo mode: acepta cualquier combinación de credenciales
  - Rol admin si el email contiene "admin"
  - Redirección automática al dashboard tras login exitoso
  - Redirección automática desde login si ya está autenticado

#### Protección de Rutas
- **AuthGuard Component**: Protege todas las rutas principales
- **Redirección automática**: Si no está autenticado, redirige a `/login`
- **Verificación de estado**: Muestra loading mientras verifica autenticación

#### Logout
- **Ubicación**: Header de la aplicación (menú de usuario)
- **Funcionalidad**: Limpia estado y redirige a `/login`

### APIs Requeridas para Integración Backend

#### POST /api/usuarios/login
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña",
  "from": "web"
}

// Respuesta esperada (201):
{
  "success": true,
  "message": "el usuario fue autenticado",
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "usuario@ejemplo.com",
    "rasgosDistintivos": "Alto, Barba, Lentes",
    "dispositivos": [],
    "atribucionDeUsuario": [],
    "atribucionDeGrupos": [],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nivelAcceso": "admin",
    "empresas": [
      {
        "id": 1,
        "nombre": "Empresa ABC"
      }
    ],
    "solicitarCambioPassword": false,
    "fechaCambioPassword": "2024-01-15T10:30:00Z"
  }
}

// Errores posibles:
// 404: Usuario no existe
// 403: Usuario no confirmado o contraseña incorrecta
// 400: Usuario sin dispositivo vinculado
```

#### POST /api/auth/logout
```json
// Headers: Authorization: Bearer <access_token>

// Respuesta esperada:
{
  "success": true,
  "message": "Logout exitoso"
}
```

#### GET /api/usuarios/perfil
```json
// Headers: Authorization: Bearer <access_token>

// Respuesta esperada (200):
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "usuario@ejemplo.com",
  "telefono": "+56912345678",
  "nivelAcceso": "admin",
  "rasgosDistintivos": "Alto, Barba",
  "dispositivos": [],
  "empresas": [
    {
      "id": 1,
      "nombre": "Empresa ABC"
    }
  ]
}
```

### Modificaciones Frontend Necesarias para Backend

1. **Servicio de API**: Crear servicio para comunicación con backend
```typescript
// lib/auth.service.ts
export class AuthApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) throw new Error('Login failed')
    return response.json()
  }

  async logout() {
    const token = localStorage.getItem('accessToken')
    await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  async getCurrentUser() {
    const token = localStorage.getItem('accessToken')
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  }
}
```

2. **Persistencia de Tokens**: Almacenar tokens en localStorage/cookies
3. **Interceptor de API**: Manejar refresh de tokens automáticamente
4. **Validación de Sesión**: Verificar validez del token al cargar la app

### Variables de Entorno Frontend
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_TENANT_ID=default_tenant
```

## 🎫 Sistema de Tickets

### Modelo de Datos
```typescript
model Ticket {
  id              String         @id @default(cuid())
  title           String
  description     String
  status          TicketStatus   @default(OPEN)
  priority        TicketPriority @default(MEDIUM)
  channel         Channel        @default(EMAIL)

  // Relaciones
  customer_id     String
  customer        User           @relation("CustomerTickets", fields: [customer_id], references: [id])

  assigned_to     String?
  assignee        User?          @relation("AssignedAgent", fields: [assigned_to], references: [id])

  category_id     String?
  category        TicketCategory? @relation(fields: [category_id], references: [id])

  // Metadatos
  sla_due_at      DateTime?
  resolved_at     DateTime?
  first_response_at DateTime?

  created_at      DateTime       @default(now())
  updated_at      DateTime       @updatedAt

  // Conversación
  messages        TicketMessage[]
  activities      Activity[]

  @@map("tickets")
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  WAITING
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Channel {
  EMAIL
  CHAT
  PHONE
  SOCIAL
  WEB
}

model TicketMessage {
  id          String    @id @default(cuid())
  content     String
  is_internal Boolean   @default(false)

  // Relaciones
  ticket_id   String
  ticket      Ticket    @relation(fields: [ticket_id], references: [id], onDelete: Cascade)

  author_id   String
  author      User      @relation(fields: [author_id], references: [id])

  created_at  DateTime  @default(now())

  @@map("ticket_messages")
}

model TicketCategory {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String?

  tickets     Ticket[]

  created_at  DateTime @default(now())

  @@map("ticket_categories")
}
```

### API de Tickets
```typescript
// src/modules/tickets/tickets.controller.ts
export class TicketsController {

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getTickets(
    @Query() query: GetTicketsDto,
    @Tenant() tenant: TenantEntity,
    @User() user: UserEntity
  ) {
    return this.ticketsService.findAll(query, tenant.id, user)
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @Tenant() tenant: TenantEntity,
    @User() user: UserEntity
  ) {
    return this.ticketsService.create(createTicketDto, tenant.id, user)
  }

  @Patch('/:id/assign')
  @UseGuards(JwtAuthGuard, RoleGuard([UserRole.AGENT, UserRole.TENANT_ADMIN]))
  async assignTicket(
    @Param('id') ticketId: string,
    @Body() assignDto: AssignTicketDto,
    @Tenant() tenant: TenantEntity
  ) {
    return this.ticketsService.assign(ticketId, assignDto.agentId, tenant.id)
  }
}
```

## 📊 Sistema de Analytics

### Modelo de Métricas
```typescript
model DashboardMetric {
  id          String    @id @default(cuid())
  metric_type String    // 'tickets_created', 'response_time', etc.
  value       Float
  date        DateTime

  // Dimensiones adicionales
  channel     String?
  priority    String?
  agent_id    String?

  tenant_id   String
  created_at  DateTime  @default(now())

  @@map("dashboard_metrics")
  @@index([tenant_id, metric_type, date])
}

model Activity {
  id          String      @id @default(cuid())
  type        ActivityType
  description String
  metadata    Json?

  // Relaciones
  user_id     String
  user        User        @relation(fields: [user_id], references: [id])

  ticket_id   String?
  ticket      Ticket?     @relation(fields: [ticket_id], references: [id])

  created_at  DateTime    @default(now())

  @@map("activities")
}

enum ActivityType {
  TICKET_CREATED
  TICKET_ASSIGNED
  TICKET_RESOLVED
  MESSAGE_SENT
  USER_LOGIN
}
```

## 🔧 Configuración de Base de Datos

### Schema Prisma Principal
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modelos base aquí...
```

### Migraciones Multitenant
```typescript
// src/core/database/migration.service.ts
export class MigrationService {
  async createTenantSchema(tenantId: string, schemaName: string) {
    await this.prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)

    // Aplicar migraciones al nuevo schema
    await this.runMigrationsForSchema(schemaName)

    return { success: true, schema: schemaName }
  }

  async runMigrationsForSchema(schemaName: string) {
    // Ejecutar migraciones Prisma para el schema específico
    const migrationCommands = this.getMigrationCommands(schemaName)

    for (const command of migrationCommands) {
      await this.prisma.$executeRawUnsafe(command)
    }
  }
}
```

## 🚀 Comandos de Desarrollo

### Configuración Inicial
```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Ejecutar seeds
npx prisma db seed
```

### Desarrollo
```bash
# Desarrollo local
npm run dev

# Ejecutar tests
npm run test

# Linting
npm run lint

# Build de producción
npm run build
```

### Gestión de Tenants
```bash
# Crear nuevo tenant
npm run tenant:create -- --name "Empresa Demo" --subdomain "demo"

# Migrar tenant específico
npm run tenant:migrate -- --schema "tenant_demo"

# Backup de tenant
npm run tenant:backup -- --schema "tenant_demo"
```

## 🔐 Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/followus"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Redis
REDIS_URL="redis://localhost:6379"

# Email
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-password"

# Storage
AWS_S3_BUCKET="followus-files"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
```

## 🧪 Testing

### Estructura de Tests
```typescript
// tests/modules/tickets/tickets.service.spec.ts
describe('TicketsService', () => {
  let service: TicketsService
  let tenant: TenantEntity

  beforeEach(async () => {
    tenant = await createTestTenant()
    service = new TicketsService(getPrismaForTenant(tenant.schema_name))
  })

  afterEach(async () => {
    await cleanupTestTenant(tenant.schema_name)
  })

  it('should create a ticket', async () => {
    const ticketData = { title: 'Test', description: 'Test ticket' }
    const ticket = await service.create(ticketData, tenant.id)

    expect(ticket.title).toBe('Test')
    expect(ticket.status).toBe(TicketStatus.OPEN)
  })
})
```

## 📈 Próximos Pasos

### Fase 1: Core Multitenant (Semanas 1-3)
1. Configurar PostgreSQL y Prisma
2. Implementar gestión de tenants
3. Sistema de autenticación JWT
4. Middleware de tenant isolation

### Fase 2: Usuarios y Tickets (Semanas 4-6)
1. CRUD completo de usuarios
2. Sistema de roles y permisos
3. CRUD completo de tickets
4. Sistema de mensajería

### Fase 3: Funcionalidades Avanzadas (Semanas 7-10)
1. Base de conocimientos
2. Gestión de canales
3. Sistema de analytics
4. Optimizaciones de rendimiento

Esta documentación proporciona la base para desarrollar un backend robusto y escalable que satisfaga las necesidades de la aplicación followus-web frontend.