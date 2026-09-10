import type { Metadata } from 'next';
import React from 'react';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import WhatsAppWidget from './WhatsAppWidget';
import ScrollToTop from './ScrollToTop';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['500', '600'],
});

export const metadata: Metadata = {
  title: 'TexasBlue.lk | Sri Lanka Wholesale Garment Supplier',
  description: 'TexasBlue.lk is a Sri Lankan wholesale garment business supplying premium fashion brands to retailers and business buyers island-wide.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ScrollToTop />
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}

