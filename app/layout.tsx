import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { resolveAppBaseUrl } from '@/lib/config/runtime-urls';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(resolveAppBaseUrl()),
  title: 'Leapfrog Connect - LMS',
  description: 'Skills to Jobs Pipeline',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Leapfrog Connect',
  },
  formatDetection: {
    telephone: false,
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
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}