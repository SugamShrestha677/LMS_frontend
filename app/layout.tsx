import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { resolveAppBaseUrl } from '@/lib/config/runtime-urls';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(resolveAppBaseUrl()),
  title: 'Leapfrog Connect | Learning Management System',
  description:
  'Learn job-ready skills, track progress, and connect education with career opportunities.',

  verification: {
    google: '6nAkUvyJNiUYmFWrdAFlU7JQDaNiu6EBSBf9XbB0LTM',
  },

  openGraph: {
    title: 'Leapfrog Connect | Learning Management System',
    description:
      'Learn job-ready skills, track progress, and connect education with career opportunities.',
    url: 'https://skillbridge-eight-iota.vercel.app',
    siteName: 'Leapfrog Connect',
    type: 'website',
    images: [
    {
      url: '/icon001.png',
      width: 512,
      height: 512,
      alt: 'Leapfrog Connect',
    },
  ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Leapfrog Connect | Learning Management System',
    description:
      'Learn job-ready skills, track progress, and connect education with career opportunities.',
    images: ['/icon001.png'],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Leapfrog Connect',
  },
  formatDetection: {
    telephone: false,
  },

  alternates: {
    canonical: '/',
  },

  icons: {
    icon: '/icon001.png',
    apple: '/icon001.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Leapfrog Connect',
    url: 'https://skillbridge-eight-iota.vercel.app',
    logo: 'https://skillbridge-eight-iota.vercel.app/icon001.png',
  };
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}