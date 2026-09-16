import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';

export const metadata: Metadata = {
  title: 'SECUREEXAM • Secure Examination Paper Distribution Using Blockchain',
  description: 'Encrypted, blockchain-registered, and time-locked examination paper management and distribution platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-100 selection:text-blue-900">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
