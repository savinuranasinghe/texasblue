import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import WhatsAppWidget from './WhatsAppWidget';
import ScrollToTop from './ScrollToTop';

export const metadata: Metadata = {
  title: 'TexasBlue.lk | Sri Lanka Wholesale Garment Supplier',
  description: 'TexasBlue.lk is a Sri Lankan wholesale garment business supplying premium fashion brands to retailers and business buyers island-wide.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollToTop />
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
