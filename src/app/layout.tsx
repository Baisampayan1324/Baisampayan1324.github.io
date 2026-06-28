import type { Metadata } from 'next';
import './globals.css';
import { LenisProvider } from '@/providers/lenis-provider';

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
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
