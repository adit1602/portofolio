import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/theme/ThemeProvider'

// Runs before hydration to apply a saved light-mode preference without a flash.
// The site otherwise always defaults to dark (see ThemeProvider).
const THEME_INIT_SCRIPT = `
  try {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
`

export const metadata: Metadata = {
  title: {
    default: 'Portfolio — Backend & DevOps Engineer',
    template: '%s | Portfolio',
  },
  description:
    'Personal portfolio of a backend and DevOps engineer. Specializing in distributed systems, REST APIs, and cloud infrastructure.',
  keywords: ['backend engineer', 'devops', 'portfolio', 'node.js', 'golang', 'kubernetes'],
  authors: [{ name: 'Portfolio Owner' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
