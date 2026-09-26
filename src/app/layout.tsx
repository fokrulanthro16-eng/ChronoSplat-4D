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
    <html lang="en" className="bg-[#030712] text-slate-100 dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#030712" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="bg-[#030712] min-h-screen text-slate-100 antialiased m-0 p-0 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
