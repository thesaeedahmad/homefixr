import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

/*
  Inter is loaded via next/font (self-hosted automatically — no external request
  at runtime, good for performance and privacy). It is exposed as a CSS variable
  so Tailwind's `font-sans` token can reference it.
*/
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'HomeFixr — Connecting Homeowners with Trusted Professionals',
  description:
    'Post home maintenance jobs, receive competitive bids from verified professionals, and hire with confidence.',
};

/*
  Root layout wraps every page. `lang="en"` is set for screen readers and
  correct text handling (accessibility).
*/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
