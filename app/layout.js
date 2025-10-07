import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import AppFrame from './components/AppFrame'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'vipmilfnut - Premium Adult Entertainment Videos',
    template: '%s | vipmilfnut'
  },
  description: 'Watch premium adult entertainment videos featuring top stars and categories. High quality content updated daily.',
  keywords: 'adult videos, premium content, entertainment, streaming',
  authors: [{ name: 'vipmilfnut' }],
  creator: 'vipmilfnut',
  publisher: 'vipmilfnut',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vipmilfnut.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vipmilfnut.com',
    siteName: 'vipmilfnut',
    title: 'vipmilfnut - Premium Adult Entertainment Videos',
    description: 'Watch premium adult entertainment videos featuring top stars and categories. High quality content updated daily.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'vipmilfnut - Premium Adult Entertainment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vipmilfnut - Premium Adult Entertainment Videos',
    description: 'Watch premium adult entertainment videos featuring top stars and categories. High quality content updated daily.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'aGfyXFqm1ny07jojrD2d9oSTr_u3D_4MZCTFPqBkr9o',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Bootstrap Icons for admin action buttons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
        {/* Optional: Bootstrap CSS for admin UI (buttons, tables). Uncomment if needed globally. */}
        {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" /> */}
      </head>
      <body className={jakarta.className}>
        <AppFrame>
          {children}
        </AppFrame>
      </body>
    </html>
  )
}
