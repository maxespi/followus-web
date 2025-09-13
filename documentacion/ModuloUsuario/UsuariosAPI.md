Documentación de Autenticación y Gestión de Usuarios
Modelos de Datos
Usuario
El modelo de Usuario contiene los siguientes campos principales:
CampoTipoDescripciónidINTEGERIdentificador único (autoincremental)rutSTRINGRUT del usuariogradoSTRINGGrado/rango del usuarionombreSTRINGNombre del usuarioapellidoSTRINGApellido del usuarioemailSTRINGCorreo electrónico (único)passwordSTRINGContraseña hasheada con bcrypttelefonoSTRINGTeléfono del usuarioconfirmadoBOOLEANEstado de confirmación de cuentatokenSTRINGToken temporal para confirmación/recuperaciónnivelAccesoSTRINGNivel de acceso del usuariorasgosDistintivosSTRINGCaracterísticas distintivas (máx. 3, separadas por comas)solicitarCambioPasswordBOOLEANFlag para forzar cambio de contraseñafechaCambioPasswordDATEFecha del último cambio de contraseñaultimoLoginDATEFecha y hora del último loginloginSTRINGInformación adicional de logincreatedAtDATEFecha de creaciónupdatedAtDATEFecha de última actualización
Relaciones del Usuario
El usuario tiene las siguientes relaciones:

Empresas: Relación muchos a muchos a través de UsuarioConfiguracion
Dispositivos: Relación muchos a muchos a través de UsuarioDispositivo
AtribucionAtributo: Permisos individuales del usuario
AtribucionGrupo: Grupos de permisos asignados
EmpresaUnidadCargo: Cargo dentro de la estructura organizacional

API Routes
Base URL
/api/usuarios
Autenticación
Todas las rutas protegidas requieren token JWT enviado en headers mediante middleware checkAuth.

Endpoints de Autenticación
1. Login de Usuario
   POST /api/usuarios/login
   Descripción: Autentica un usuario y retorna token JWT.
   Body:
   json{
   "email": "usuario@ejemplo.com",
   "password": "contraseña123",
   "from": "web" // Opcional: "web" o "app"
   }
   Respuesta Exitosa (201):
   json{
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
   Errores Posibles:

404: Usuario no existe
403: Usuario no confirmado o contraseña incorrecta
400: Usuario sin dispositivo vinculado (si aplica)

2. Registro de Usuario
   POST /api/usuarios
   Descripción: Registra un nuevo usuario y envía email de confirmación.
   Body:
   json{
   "rut": "12345678-9",
   "nombre": "Juan",
   "apellido": "Pérez",
   "email": "usuario@ejemplo.com",
   "password": "contraseña123",
   "telefono": "+56912345678",
   "empresas": [1, 2] // IDs de empresas (requerido)
   }
   Respuesta Exitosa (200):
   json{
   "msg": "Usuario creado correctamente, revisa tu email para confirmar cuenta"
   }
   Errores Posibles:

400: Usuario ya registrado o empresas inválidas

3. Confirmar Cuenta
   GET /api/usuarios/confirmar/:token
   Descripción: Confirma la cuenta de usuario mediante token enviado por email.
   Parámetros:

token (path): Token de confirmación

Respuesta Exitosa (200):
json{
"msg": "Usuario confirmado correctamente"
}
Errores Posibles:

403: Token no válido

Gestión de Contraseñas
4. Recuperar Contraseña - Solicitud
   POST /api/usuarios/olvide-password
   Descripción: Envía email con instrucciones para recuperar contraseña.
   Body:
   json{
   "email": "usuario@ejemplo.com"
   }
   Respuesta Exitosa (200):
   json{
   "msg": "Hemos enviado un email con las instrucciones"
   }
   Errores Posibles:

404: Usuario no existe

5. Recuperar Contraseña - Validar Token
   GET /api/usuarios/olvide-password/:token
   Descripción: Valida el token de recuperación de contraseña.
   Parámetros:

token (path): Token de recuperación

Respuesta Exitosa (200):
json{
"msg": "Token válido y usuario existe"
}
Errores Posibles:

404: Token no válido

6. Recuperar Contraseña - Establecer Nueva
   POST /api/usuarios/olvide-password/:token
   Descripción: Establece una nueva contraseña usando el token de recuperación.
   Parámetros:

token (path): Token de recuperación

Body:
json{
"password": "nuevaContraseña123"
}
Respuesta Exitosa (200):
json{
"msg": "Password modificado correctamente"
}
Errores Posibles:

404: Token no válido

7. Cambiar Contraseña (Usuario Autenticado)
   POST /api/usuarios/cambiar-password 🔒
   Descripción: Permite al usuario autenticado cambiar su contraseña.
   Headers:
   Authorization: Bearer {token}
   Body:
   json{
   "currentPassword": "contraseñaActual",
   "newPassword": "nuevaContraseña123"
   }
   Respuesta Exitosa (200):
   json{
   "msg": "Contraseña actualizada exitosamente"
   }
   Notas:

Actualiza solicitarCambioPassword a false
Registra la fecha del cambio en fechaCambioPassword

Errores Posibles:

400: Campos faltantes
403: Contraseña actual incorrecta
404: Usuario no encontrado

8. Actualizar Contraseña (Admin)
   POST /api/usuarios/changepass
   Descripción: Permite a un administrador cambiar la contraseña de cualquier usuario.
   Body:
   json{
   "id": 1,
   "newPassword": "nuevaContraseña123"
   }
   Respuesta Exitosa (200):
   json{
   "msg": "Contraseña actualizada exitosamente"
   }
   Errores Posibles:

404: Usuario no encontrado

Gestión de Usuarios
9. Obtener Perfil del Usuario Actual
   GET /api/usuarios/perfil 🔒
   Descripción: Obtiene el perfil completo del usuario autenticado.
   Headers:
   Authorization: Bearer {token}
   Respuesta Exitosa (200):
   json{
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
10. Obtener Usuario por ID
    GET /api/usuarios/:id 🔒
    Descripción: Obtiene información de un usuario específico.
    Parámetros:

id (path): ID del usuario

Respuesta: Objeto usuario sin contraseña, incluyendo dispositivos y empresas.
11. Obtener Todos los Usuarios
    GET /api/usuarios/usuarios 🔒
    Descripción: Lista todos los usuarios del sistema con sus relaciones.
    Respuesta: Array de usuarios con:

Información básica (sin contraseña)
Dispositivos vinculados
Grupos de atribución
Atributos de permisos
Empresas asociadas
Cargo en la estructura organizacional

12. Editar Usuario
    PUT /api/usuarios/usuarios/:id 🔒
    Descripción: Actualiza información de un usuario.
    Parámetros:

id (path): ID del usuario

Body: (todos los campos son opcionales)
json{
"rut": "12345678-9",
"grado": "Capitán",
"nombre": "Juan",
"apellido": "Pérez",
"email": "nuevo@ejemplo.com",
"telefono": "+56987654321",
"nivelAcceso": "supervisor",
"rasgosDistintivos": "Alto, Barba",
"empresas": [1, 2, 3]
}
Notas:

Al actualizar empresas, se eliminan las relaciones existentes y se crean las nuevas

13. Eliminar Usuario
    DELETE /api/usuarios/usuarios/:id 🔒
    Descripción: Elimina un usuario del sistema.
    Parámetros:

id (path): ID del usuario

Respuesta Exitosa (200):
json"Usuario eliminada"
Códigos de Estado HTTP
CódigoDescripción200Operación exitosa201Recurso creado exitosamente400Solicitud incorrecta (datos inválidos)403Prohibido (sin permisos o credenciales incorrectas)404Recurso no encontrado500Error interno del servidor
Notas de Seguridad

Contraseñas: Todas las contraseñas se almacenan hasheadas usando bcrypt con salt de 10 rounds
Tokens JWT: Los tokens de autenticación se generan con la función generarJWT
Confirmación de cuenta: Los usuarios deben confirmar su email antes de poder iniciar sesión
Período de gracia: Los tokens de recuperación son temporales y de un solo uso
Middleware de autenticación: Las rutas marcadas con 🔒 requieren autenticación mediante checkAuth

Flujos de Usuario
Flujo de Registro

Usuario envía datos de registro → POST /api/usuarios
Sistema crea usuario con confirmado = false y genera token
Sistema envía email con link de confirmación
Usuario hace clic en link → GET /api/usuarios/confirmar/:token
Sistema marca confirmado = true y elimina token
Usuario puede iniciar sesión

Flujo de Recuperación de Contraseña

Usuario solicita recuperación → POST /api/usuarios/olvide-password
Sistema genera token y envía email
Usuario valida token → GET /api/usuarios/olvide-password/:token
Usuario envía nueva contraseña → POST /api/usuarios/olvide-password/:token
Sistema actualiza contraseña y elimina token

Flujo de Cambio de Contraseña Forzado

Admin marca solicitarCambioPassword = true para un usuario
Frontend detecta este flag en el login
Usuario debe cambiar contraseña → POST /api/usuarios/cambiar-password
Sistema actualiza solicitarCambioPassword = false y registra fecha
