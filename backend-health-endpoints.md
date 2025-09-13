# Endpoints de Salud para Backend

## 1. Endpoint Básico de Salud (/api/health)

### Node.js/Express
```javascript
// routes/health.js o en tu archivo principal
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'online',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'followus-backend'
    },
    message: 'Servidor funcionando correctamente'
  })
})

// Endpoint alternativo más simple
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Endpoint de ping básico
app.get('/api/ping', (req, res) => {
  res.status(200).send('pong')
})
```

### Node.js/Fastify
```javascript
// routes/health.js o en tu archivo principal
fastify.get('/api/health', async (request, reply) => {
  return {
    success: true,
    data: {
      status: 'online',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'followus-backend'
    },
    message: 'Servidor funcionando correctamente'
  }
})

// Endpoint alternativo
fastify.get('/api/status', async (request, reply) => {
  return { status: 'ok' }
})
```

### Python/Flask
```python
# app.py o routes.py
@app.route('/api/health', methods=['GET'])
def health_check():
    return {
        "success": True,
        "data": {
            "status": "online",
            "timestamp": datetime.now().isoformat(),
            "service": "followus-backend"
        },
        "message": "Servidor funcionando correctamente"
    }

@app.route('/api/status', methods=['GET'])
def status_check():
    return {"status": "ok"}
```

### Python/FastAPI
```python
# main.py
@app.get("/api/health")
async def health_check():
    return {
        "success": True,
        "data": {
            "status": "online",
            "timestamp": datetime.now().isoformat(),
            "service": "followus-backend"
        },
        "message": "Servidor funcionando correctamente"
    }

@app.get("/api/status")
async def status_check():
    return {"status": "ok"}
```

## 2. Endpoint de Salud Completa (Recomendado)

```javascript
// Endpoint más completo con verificación de dependencias
app.get('/api/health', async (req, res) => {
  try {
    // Verificar base de datos (ejemplo con Prisma)
    const dbStatus = await checkDatabaseConnection()

    // Verificar Redis (si lo usas)
    const redisStatus = await checkRedisConnection()

    const healthData = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'followus-backend',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        dependencies: {
          database: dbStatus,
          redis: redisStatus,
          // Agregar otros servicios según necesites
        }
      },
      message: 'Todos los servicios funcionando correctamente'
    }

    res.status(200).json(healthData)
  } catch (error) {
    res.status(503).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'followus-backend'
      },
      error: 'Error en verificación de salud',
      message: error.message
    })
  }
})

// Funciones auxiliares
async function checkDatabaseConnection() {
  try {
    // Con Prisma
    await prisma.$queryRaw`SELECT 1`
    return { status: 'connected', latency: 0 }
  } catch (error) {
    return { status: 'disconnected', error: error.message }
  }
}

async function checkRedisConnection() {
  try {
    // Con Redis
    await redisClient.ping()
    return { status: 'connected' }
  } catch (error) {
    return { status: 'disconnected', error: error.message }
  }
}
```

## 3. Configuración de Reverse Proxy (Nginx)

Si estás usando nginx como reverse proxy, también puedes agregar:

```nginx
# En tu configuración de nginx
location /health {
    return 200 '{"status":"ok","service":"proxy"}';
    add_header Content-Type application/json;
}

# Para el endpoint de la aplicación
location /api/health {
    proxy_pass http://localhost:3001/api/health;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 4. Implementación Rápida (Solución Inmediata)

**Para implementar rápidamente y probar ahora mismo:**

```javascript
// Agrega esto a tu archivo principal del backend
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'followus-backend', timestamp: Date.now() })
})

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/ping', (req, res) => {
  res.send('pong')
})
```

## 5. Variables de Entorno

```env
# .env
APP_VERSION=1.0.0
HEALTH_CHECK_ENABLED=true
```

## 6. Testing

Para probar que funciona:

```bash
# Desde línea de comandos
curl https://localhost/api/health
curl https://hades.cl/api/health

# O desde el navegador
https://localhost/api/health
https://hades.cl/api/health
```

## Respuesta Esperada

```json
{
  "success": true,
  "data": {
    "status": "online",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600.5,
    "service": "followus-backend"
  },
  "message": "Servidor funcionando correctamente"
}
```

---

**¿Cuál framework/lenguaje estás usando en tu backend?** Te puedo dar una implementación más específica según tu stack tecnológico.