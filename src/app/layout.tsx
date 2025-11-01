import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MotionWrapper } from '@/components/MotionWrapper';
import { AppDataProvider } from '@/context/EventContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Y-Ultimate Pulse',
  description: 'Connecting Students, Events & Innovation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <AuthProvider>
              <AppDataProvider>
                <MotionWrapper>
                    {children}
                </MotionWrapper>
                <Toaster />
              </AppDataProvider>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
