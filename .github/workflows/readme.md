Followus Web

Aplicación web de gestión de atención al cliente / mesa de ayuda hecha con Next.js 14, Tailwind CSS v4 (postcss preset) y componentes shadcn/ui. Incluye panel de control, gestión de tickets, base de conocimientos y administración de canales.

✨ Características

Dashboard operativo con KPIs (ver components/dashboard-overview.tsx).

Gestión de tickets: creación, listado y detalle (components/ticket-management.tsx, components/ticket-details.tsx).

Base de conocimientos con editor de artículos (components/knowledge-base.tsx, components/article-editor.tsx).

Canales: configuración y administración (components/channel-config.tsx, components/channel-management.tsx).

UI moderna con shadcn/ui (botones, diálogos, tablas, tabs, etc.).

Estilos con Tailwind v4 vía @tailwindcss/postcss.

Export estático para publicar en GitHub Pages.

🧭 Estructura de rutas (App Router)

/ — Inicio / Dashboard

/tickets — Gestión de tickets

/knowledge — Base de conocimientos

/channels — Canales

(Las páginas están en app/ y los componentes reutilizables en components/.)

🛠️ Stack

Next.js 14 (App Router)

React 18

Tailwind CSS v4 (preset oficial para PostCSS)

shadcn/ui

TypeScript

🚀 Desarrollo local
# instalar dependencias
npm ci

# levantar entorno de desarrollo
npm run dev

# compilar / exportar
npm run build


npm run dev abre http://localhost:3000/.

npm run build hace next build && next export → genera la carpeta out/ (HTML estático).

Node recomendado: 20.x LTS.

🌐 Deploy en GitHub Pages

Este repo usa GitHub Actions para construir y publicar automáticamente.

Config de Next
En next.config.mjs se usa:

output: 'export',
basePath: '/followus-web', // nombre del repo
images: { unoptimized: true }


basePath es crucial si publicas en usuario.github.io/followus-web/.

Scripts (package.json)

"scripts": {
"dev": "next dev",
"build": "next build && next export",
"start": "next start",
"lint": "next lint"
}


Workflow
Archivo .github/workflows/deploy.yml que:

Instala dependencias,

ejecuta npm run build,

sube ./out como artefacto y

despliega a Pages.

Activar Pages
Repo → Settings → Pages → Build and deployment: GitHub Actions.

URL final
https://<tu-usuario>.github.io/followus-web/
(Aparece también como salida del job Deploy to GitHub Pages).

📦 Aliases / TS / Tailwind

Aliases TS: @/* resuelve a ./src/raíz (ver tsconfig.json).

Tailwind v4: configurado con @tailwindcss/postcss y postcss.config.mjs.

🧪 Comandos útiles
# limpiar caché y reinstalar (Windows, si se bloquean .node nativos)
npm cache clean --force
rd /s /q node_modules .next .turbo
npm ci

🐞 Troubleshooting

Página no carga assets / 404 en rutas
Verifica basePath en next.config.mjs coincide con el nombre del repo.

“next no se reconoce…”
Falta node_modules: vuelve a instalar (npm ci).

EPERM / unlink en Windows (Tailwind Oxide)
Cierra editores y procesos node.exe, elimina node_modules, limpia caché y reinstala.

Limitaciones de export estático

API Routes y Server Actions no se publican en Pages.

next/image usa images.unoptimized: true.

Rutas dinámicas deben ser pre-generadas en build.

📄 Licencia

Libre uso interno / demo. Ajusta a la licencia que prefieras.
