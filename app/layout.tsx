import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import React from 'react';

const inter = Inter({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Photo Gallery',
    description: 'A modern photo gallery application',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem={true}
                    storageKey="gallery-theme"
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
