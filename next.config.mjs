/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/followus-web',       
  images: { unoptimized: true },

  // (opcional) mientras estabilizas el tipado/linter en CI:
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}
export default nextConfig
