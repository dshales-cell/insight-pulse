import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Insight Pulse | Women's Health World",
  description:
    "We run regular surveys to build a global picture of women's health and wellbeing — and create a mandate for change.",
  icons: {
    icon: [
      { url: 'https://womenshealth.world/wp-content/uploads/2026/10/cropped-WHW-logo-mark-transparent-32x32.png', sizes: '32x32' },
      { url: 'https://womenshealth.world/wp-content/uploads/2026/10/cropped-WHW-logo-mark-transparent-192x192.png', sizes: '192x192' },
    ],
    apple: 'https://womenshealth.world/wp-content/uploads/2026/10/cropped-WHW-logo-mark-transparent-180x180.png',
  },
  openGraph: {
    title: "Insight Pulse | Women's Health World",
    description: "Share your voice. Shape the future of women's health.",
    url: 'https://pulse.womenshealth.world',
    siteName: "Women's Health World",
    type: 'website',
    images: [
      {
        url: 'https://womenshealth.world/wp-content/uploads/2026/10/WHW-Brand-image-1200-x-675-px.png',
        width: 1200,
        height: 675,
        alt: "Women's Health World",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Insight Pulse | Women's Health World",
    description: "Share your voice. Shape the future of women's health.",
    images: ['https://womenshealth.world/wp-content/uploads/2026/10/WHW-Brand-image-1200-x-675-px.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* ── Site Header ── */}
        <header className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <a href="https://womenshealth.world" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Women's Health World" className="w-8 h-8" />
              <span className="text-sm font-semibold text-brand-purple group-hover:text-brand-pink hidden sm:inline">
                Women&apos;s Health World
              </span>
            </a>
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
              Insight Pulse
            </span>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1">{children}</main>

        {/* ── Site Footer ── */}
        <footer className="bg-white border-t border-gray-100 px-4 py-6 mt-12">
          <div className="max-w-2xl mx-auto text-center text-xs text-gray-400 space-y-1">
            <p>© {new Date().getFullYear()} Women&apos;s Health World. All rights reserved.</p>
            <p>
              <a href="/privacy" className="underline hover:text-brand-pink">Privacy Policy</a>
              {' · '}
              <a href="https://womenshealth.world" className="underline hover:text-brand-pink">
                Main Website
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
