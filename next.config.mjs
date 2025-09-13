/** @type {import('next').NextConfig} */
const nextConfig = {
  // Solo usar export y basePath para producción/GitHub Pages
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    basePath: '/followus-web',
    images: { unoptimized: true },
  }),

  // Para desarrollo local, sin basePath
  ...(process.env.NODE_ENV === 'development' && {
    images: { unoptimized: true },
  }),

  // (opcional) mientras estabilizas el tipado/linter en CI:
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
