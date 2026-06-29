import type { Metadata } from 'next';
import './globals.css';
import { LenisProvider } from '@/providers/lenis-provider';
import LiveCounter from '@/components/ui/live-counter';

export const metadata: Metadata = {
  title: 'Baisampayan Dey — AI/ML Engineer',
  description:
    'Portfolio of Baisampayan Dey — AI/ML Developer specialising in RAG pipelines, LLM-based applications, and production inference systems.',
  openGraph: {
    title: 'Baisampayan Dey — AI/ML Engineer',
    description:
      'AI/ML Developer building production-ready systems: RAG pipelines, agentic AI, real-time inference.',
    url: 'https://baisampayan1324.github.io',
    siteName: 'Baisampayan Dey',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baisampayan Dey — AI/ML Engineer',
    description:
      'AI/ML Developer building production-ready systems: RAG pipelines, agentic AI, real-time inference.',
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon.ico' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/favicons/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <LiveCounter />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
