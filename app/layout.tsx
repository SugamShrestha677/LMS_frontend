import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { resolveAppBaseUrl } from '@/lib/config/runtime-urls';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(resolveAppBaseUrl()),
  applicationName: 'Leapfrog Connect',
  title: 'Leapfrog Connect | Learn Skills & Build Careers',
  description:
    'Leapfrog Connect is an online learning platform that helps students develop job-ready skills, track progress, and connect education with career opportunities.',
  keywords: [
    'Leapfrog Connect',
    'online learning platform',
    'learning management system',
    'LMS Nepal',
    'student career platform',
    'job ready skills',
    'online courses',
    'skill development platform',
    'career development',
    'education platform Nepal',
  ],

  referrer: 'origin-when-cross-origin',

  authors: [
    {
      name: 'Leapfrog Connect',
      url: 'https://buildandhire.me',
    },
  ],

  creator: 'Leapfrog Connect',
  publisher: 'Leapfrog Connect',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  category: 'education',
  verification: {
    google: '6nAkUvyJNiUYmFWrdAFlU7JQDaNiu6EBSBf9XbB0LTM',
  },

  openGraph: {
    title: 'Leapfrog Connect | Learn Skills & Build Careers',
    description:
      'Leapfrog Connect is an online learning platform that helps students develop job-ready skills, track progress, and connect education with career opportunities.',
    url: 'https://buildandhire.me',
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
    title: 'Leapfrog Connect | Learn Skills & Build Careers',
    description:
      'Leapfrog Connect is an online learning platform that helps students develop job-ready skills, track progress, and connect education with career opportunities.',
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
    url: 'https://buildandhire.me',
    logo: 'https://buildandhire.me/icon001.png',
    description:
      'Learning management platform that connects education with career opportunities.',
  };


  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Leapfrog Connect',
    url: 'https://buildandhire.me',
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}