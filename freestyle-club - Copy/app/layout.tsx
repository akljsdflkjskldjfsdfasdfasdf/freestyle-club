import type { Metadata, Viewport } from "next";
import { Unbounded, Inter } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "FREESTYLER — Rezervacije",
    template: "%s — FREESTYLER",
  },
  description: siteConfig.description,
  applicationName: "FREESTYLER",
  keywords: [
    "Freestyler",
    "splav Beograd",
    "noćni klub",
    "rezervacije",
    "separe",
    "Sava",
    "provod Beograd",
  ],
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: siteConfig.url,
    siteName: "FREESTYLER",
    title: "FREESTYLER — Rezervacije",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "FREESTYLER — rečni splav na Savi, Beograd",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FREESTYLER — Rezervacije",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#06030d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className={`${unbounded.variable} ${inter.variable} antialiased`}
    >
      <body>
        {children}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
