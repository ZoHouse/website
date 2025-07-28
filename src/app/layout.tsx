import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'zohm',
  description: 'Interactive map of Zo House events and community members',
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
  },
  mobileWebAppCapable: true,
  appleWebApp: {
    title: 'Zo House',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/spinner_Z_4.gif',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
