import React, { useEffect } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from './components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HOMY - Smart Home Management & Product Recommendations',
  description: 'AI-powered home management assistant helping you find the best cleaning products and solutions for your home.',
  keywords: 'home management, cleaning products, smart home, AI recommendations, vacuum cleaners, cleaning supplies',
  openGraph: {
    title: 'HOMY - Smart Home Management',
    description: 'Get personalized product recommendations for your home',
    images: ['/og-image.png'],
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1a365d', // navy-900
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add spotlight effect
  useEffect(() => {
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    document.body.appendChild(spotlight);

    const handleMouseMove = (e: MouseEvent) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      spotlight.remove();
    };
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-white via-tan-light to-tan-main`} suppressHydrationWarning>
        <div className="min-h-screen relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <main className="pb-[60px]">
              {children}
            </main>
          </div>
          <Navigation />
        </div>
      </body>
    </html>
  );
} 