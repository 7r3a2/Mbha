import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import FullscreenButton from './components/FullscreenButton'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MBHA - منصة تعليمية متكاملة",
  description: "منصة تعليمية متكاملة تهدف إلى تهيئة الطلبة الامتحانات الوزاري الخاصة بوزارة التعليم العراقية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="MBHA" />
        <meta name="application-name" content="MBHA" />
        <meta name="msapplication-TileColor" content="#3A8431" />
        <meta name="theme-color" content="#3A8431" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logo app.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo app.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo app.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logo app.png" />
        <link rel="mask-icon" href="/images/logo app.png" color="#3A8431" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ErrorBoundary>
            {children}
            <FullscreenButton />
          </ErrorBoundary>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
