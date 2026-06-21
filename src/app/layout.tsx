import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const siteUrl = "https://rivanlingga.vercel.app";
const siteName = "Rivan Awal Lingga";
const title = "Rivan Awal Lingga — Photojournalist & Visual Storyteller";
const description =
  "Award-winning Indonesian photojournalist specializing in editorial, documentary, and photo-essay storytelling that captures raw human emotion with honesty and impact.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Rivan Awal Lingga",
  },
  description,
  applicationName: siteName,
  keywords: [
    "Rivan Awal Lingga",
    "photojournalist",
    "photographer Indonesia",
    "Indonesian photojournalist",
    "documentary photography",
    "editorial photography",
    "photo essay",
    "visual storyteller",
    "ANTARA photojournalist",
    "award-winning photographer",
  ],
  authors: [{ name: "Rivan Awal Lingga" }],
  creator: "Rivan Awal Lingga",
  publisher: "Rivan Awal Lingga",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title,
    description,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rivan Awal Lingga portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  category: "photography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">{children}</body>
    </html>
  );
}
