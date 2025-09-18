import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kiosko Carlitos - Ofertas del Día",
  description: "Las mejores ofertas diarias en tu kiosco de confianza",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <a
                    href="/"
                    className="text-xl font-bold tracking-tight text-primary hover:text-primary/80 transition-colors"
                  >
                    Kiosko Carlitos
                  </a>
                  <p className="text-xs text-muted-foreground">Tu kiosco de confianza</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Kiosko Carlitos. Hecho con ❤️ para nuestros clientes.
              </p>
            </div>
          </div>
        </footer>

        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://wa.me/541120084655"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 float-animation"
            aria-label="Contactar por WhatsApp"
          >
            <span className="text-2xl">💬</span>
          </a>
        </div>
      </body>
    </html>
  )
}
