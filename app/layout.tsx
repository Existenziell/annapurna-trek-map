import type { Metadata } from 'next'
import 'tailwindcss/tailwind.css'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Annapurna Circuit Trek | christof.digital',
  description:
    'Follow me on the Annapurna Circuit Trek in Nepal, 2019 | christof.digital | shift-happens',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
      { type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex h-screen flex-col overflow-hidden">
        <main className="flex min-h-0 flex-1 flex-col w-full text-center bg-cloth-pattern bg-repeat dark:bg-none dark:bg-gray-900 dark:text-gray-300">
          {children}
        </main>
      </body>
    </html>
  )
}
