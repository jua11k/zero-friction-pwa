import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import { Toaster } from "sonner";
import KeyboardDrawer from "@/components/dashboard/KeyboardDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zero-Friction PWA",
  description: "Gestión inteligente y sin fricción de tus finanzas",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zero-Friction",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black pb-[env(safe-area-inset-bottom)]">
        {/* Main Content Area (Scrollable with bottom padding for Nav) */}
        <div className="flex-1 overflow-y-auto pb-20">
          {children}
        </div>
        
        {/* Global Components */}
        <BottomNav />
        <KeyboardDrawer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
