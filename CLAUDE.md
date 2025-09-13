# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `npm run dev` - Starts Next.js development server on http://localhost:5164
- **Build**: `npm run build` - Builds and exports static site for production (creates `out/` folder)
- **Lint**: `npm run lint` - Runs Next.js ESLint
- **Start**: `npm run start` - Starts production server (not used for GitHub Pages deployment)

## Environment Setup

### Development Environment
1. Copy `.env.example` to `.env.local`
2. Configure variables for your development setup:
   ```env
   NEXT_PUBLIC_API_URL=https://localhost/api
   NEXT_PUBLIC_API_DEV_IP=https://192.168.31.204/api
   NODE_ENV=development
   ```

### Production Environment
Variables are automatically loaded from `.env.production`:
- `NEXT_PUBLIC_API_URL=https://hades.cl/api` (reverse proxy setup)

### Development Server Options
- **localhost with SSL**: Use `NEXT_PUBLIC_API_URL=https://localhost/api`
- **Direct IP access**: Set `NEXT_PUBLIC_USE_DEV_IP=true` to use `NEXT_PUBLIC_API_DEV_IP`
- **Self-signed certificates**: Add `NODE_TLS_REJECT_UNAUTHORIZED=0` if needed

## Architecture Overview

This is a customer support/helpdesk web application built with Next.js 14 App Router and static export for GitHub Pages deployment.

### Technology Stack
- **Next.js 14** with App Router and static export
- **React 18** with TypeScript
- **Tailwind CSS v4** (postcss preset)
- **shadcn/ui** component library (New York style)
- **Radix UI** primitives
- **React Hook Form** with Zod validation
- **Lucide React** icons

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - Main routes: `/` (dashboard), `/tickets`, `/knowledge`, `/channels`, `/analytics`, `/users`, `/security`, `/settings`
- `components/` - React components
  - `ui/` - shadcn/ui components
  - Feature components: `dashboard-overview.tsx`, `ticket-management.tsx`, `knowledge-base.tsx`, etc.
- `lib/` - Utility functions (via shadcn/ui alias setup)

### Key Configuration
- **TypeScript**: Path aliases with `@/*` resolving to project root
- **shadcn/ui**: Configured with New York style, CSS variables, and Lucide icons
- **Next.js Config**: Conditional export/basePath for GitHub Pages production builds
- **GitHub Pages**: Automated deployment via `.github/workflows/deploy.yml`

### Component Architecture
The application follows a modular component structure:
- Layout components (`sidebar.tsx`, `header.tsx`, `main-layout.tsx`)
- Feature-specific components for each major section (tickets, knowledge base, channels, etc.)
- Extensive use of shadcn/ui components for consistent UI
- Form handling with React Hook Form and Zod validation

### Development Notes
- Uses `pnpm` for package management (lock file present)
- Static export optimized for GitHub Pages with conditional basePath
- Images configured with `unoptimized: true` for static hosting
- TypeScript and ESLint errors ignored during builds for faster iteration

### Authentication System
The application includes a complete authentication system with:
- **Login page** at `/login` with demo and real backend modes
- **Protected routes** using AuthGuard component
- **API service** for backend communication (`lib/api.service.ts`)
- **Automatic fallback** to demo mode if backend is unreachable
- **Token management** with localStorage persistence
- **Logout functionality** with server-side session cleanup

#### Backend Integration
- Production: `https://hades.cl/api` (reverse proxy)
- Development: `https://localhost/api` or `https://192.168.31.204/api`
- Expects JWT tokens in `Authorization: Bearer <token>` format
- User data normalized to: `{id, name, email, role}`