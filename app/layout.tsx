// app/layout.tsx
import type { Metadata } from 'next'
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
    title: 'FollowUS - Customer Support Platform',
    description: 'Modern customer support and helpdesk management system',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-background antialiased`}>
        <AppProvider>
            <Suspense fallback={null}>
                {children}
            </Suspense>
            <Toaster />
        </AppProvider>
        <Analytics />
        </body>
        </html>
    )
}
