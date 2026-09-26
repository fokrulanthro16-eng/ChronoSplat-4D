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
    <html lang="en" className="dark" style={{ backgroundColor: '#06070d' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#06070d" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className="bg-[#06070d] text-slate-100 min-h-screen antialiased m-0 p-0 overflow-x-hidden selection:bg-cyan-500 selection:text-black"
        style={{ backgroundColor: '#06070d' }}
      >
        {children}
      </body>
    </html>
  );
}
