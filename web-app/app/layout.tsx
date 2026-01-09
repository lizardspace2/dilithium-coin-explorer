import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { QuantumBanner } from '@/components/ui/QuantumBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: {
    default: 'Quantix Explorer | Quantum Secure Blockchain',
    template: '%s | Quantix Explorer'
  },
  description: 'The official blockchain explorer for Quantix (QTX). Track blocks, transactions, and network status on the world\'s first quantum-secure blockchain powered by Crystals-Dilithium.',
  keywords: ['Quantix', 'QTX', 'Blockchain', 'Explorer', 'Quantum Secure', 'Crystals-Dilithium', 'Crypto', 'Cryptocurrency'],
  authors: [{ name: 'Quantix Team', url: 'https://quantumresistantcoin.com' }],
  creator: 'Quantix Team',
  metadataBase: new URL('https://explorer.quantumresistantcoin.com'),
  openGraph: {
    title: 'Quantix Explorer',
    description: 'Explore the quantum-secure future of blockchain with Quantix Explorer.',
    url: 'https://explorer.quantumresistantcoin.com',
    siteName: 'Quantix Explorer',
    images: [
      {
        url: 'https://quantumresistantcoin.com/og-image.jpg', // Placeholder, assuming main site has one or we add one later
        width: 1200,
        height: 630,
        alt: 'Quantix Explorer Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantix Explorer',
    description: 'Track the quantum-secure Quantix blockchain in real-time.',
    creator: '@QuantixCoin', // Assuming handle
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} ${space.variable} font-sans`} suppressHydrationWarning>
        <QuantumBanner />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
