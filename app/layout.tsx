import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from '@/components/providers/SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import './globals.css'

// NOTE: Fonts are loaded via CSS @import in globals.css to avoid
// build-time network dependency on Google Fonts servers.
// In production on Vercel, swap back to next/font/google for optimal performance.

// ---- SEO METADATA ----
export const metadata: Metadata = {
  title: {
    default: 'Judigoods – Curated Clothing, Home & Lifestyle',
    template: '%s | Judigoods',
  },
  description:
    'Judigoods is a curated boutique offering ethically sourced clothing, handmade scarves & wraps, home décor, and lifestyle goods. Shop consciously. Live beautifully.',
  keywords: ['judigoods', 'scarves', 'clothing', 'home decor', 'lifestyle', 'handmade', 'boutique'],
  authors: [{ name: 'Judigoods' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Judigoods',
    title: 'Judigoods – Curated Clothing, Home & Lifestyle',
    description: 'Ethically sourced clothing, handmade scarves, home décor, and lifestyle goods.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Judigoods',
    description: 'Curated boutique for clothing, home & lifestyle.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            {/* ---- NAV ---- */}
            <Navbar />

            {/* ---- CART DRAWER (slides in from right) ---- */}
            <CartDrawer />

            {/* ---- MAIN CONTENT ---- */}
            <main className="min-h-screen">{children}</main>

            {/* ---- FOOTER ---- */}
            <Footer />

            {/* ---- TOAST NOTIFICATIONS ---- */}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                },
                success: { iconTheme: { primary: 'hsl(var(--primary))', secondary: '#fff' } },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
