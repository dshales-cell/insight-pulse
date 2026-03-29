import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Insight Pulse | Women\'s Health World',
  description:
    'A weekly survey series capturing the lived experience of women\'s health and wellbeing — building a global mandate for change.',
  openGraph: {
    title: 'Insight Pulse | Women\'s Health World',
    description: 'Share your voice. Shape the future of women\'s health.',
    url: 'https://pulse.womenshealth.world',
    siteName: 'Women\'s Health World',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* ── Site Header ── */}
        <header className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <a href="https://womenshealth.world" className="flex items-center gap-2 group">
              <span className="text-sm font-semibold text-brand-purple group-hover:text-brand-pink">
                ← Women's Health World
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
            <p>© {new Date().getFullYear()} Women's Health World. All rights reserved.</p>
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
