import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChronoSplat 4D | Hands-First Volumetric WebXR Cinema',
  description: 'Zero-install 6DoF volumetric spatial cinema for Meta Quest Browser.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </head>
      <body className="antialiased w-screen h-screen m-0 p-0 overflow-hidden bg-black">{children}</body>
    </html>
  );
}
