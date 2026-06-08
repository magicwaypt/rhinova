import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AccessManagementProvider } from '@/components/providers/access-management-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'RHINOVA - Gestão de Formação Inteligente',
  description: 'Plataforma SaaS de gestão de formação para equipas de RH. Automatize compliance, certificações e desenvolvimento da força de trabalho.',
  keywords: ['formação', 'RH', 'compliance', 'certificações', 'SaaS', 'gestão'],
  authors: [{ name: 'RHINOVA' }],
  creator: 'RHINOVA',
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    siteName: 'RHINOVA',
    title: 'RHINOVA - Gestão de Formação Inteligente',
    description: 'Plataforma SaaS de gestao de formacao para equipas de RH.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RHINOVA - Gestão de Formação Inteligente',
    description: 'Plataforma SaaS de gestao de formacao para equipas de RH.',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <AccessManagementProvider>{children}</AccessManagementProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
