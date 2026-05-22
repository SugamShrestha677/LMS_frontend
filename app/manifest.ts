import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Leapfrog Connect',
    short_name: 'Leapfrog',
    description: 'Skills to Jobs Pipeline',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon001.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon002.png',
        sizes: '360x360',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon003.png',
        sizes: '920x920',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/icon003.png',
        sizes: '920x920',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/icon003.png',
        sizes: '920x920',
        type: 'image/png',
      },
    ],
  };
}
