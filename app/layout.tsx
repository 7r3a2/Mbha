import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3A8431",
};

export const metadata: Metadata = {
  title: "MBHA - منصة تعليمية متكاملة",
  description: "منصة تعليمية متكاملة تهدف إلى تهيئة الطلبة الامتحانات الوزاري الخاصة بوزارة التعليم العراقية",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MBHA",
  },
  applicationName: "MBHA",
  icons: {
    icon: [
      { url: "/images/logo app.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo app.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo app.png" },
      { url: "/images/logo app.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
