import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anypart and Gear',
  description: 'Buy, Sell and Trade Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
