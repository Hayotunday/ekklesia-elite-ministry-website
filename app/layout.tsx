import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ekklesiaeliteministry.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ekklesia Elite Evangelical Ministry | Repairer of the Breach | Ikorodu, Lagos",
    template: "%s | Ekklesia Elite Evangelical Ministry",
  },
  description:
    "Ekklesia Elite Evangelical Ministry (Repairer of the Breach) is a faith-based Christian community in Ikorodu, Lagos, dedicated to youth and teens ministry, spiritual growth, Christian leadership, discipleship, and community outreach.",
  generator: "hayotunday",
  applicationName: "Ekklesia Elite Evangelical Ministry",
  category: "Religion & Spirituality",
  authors: [{ name: "Mojisola Olawale" }, { name: "Ekklesia Elite Team" }],
  creator: "Ekklesia Elite Evangelical Ministry",
  publisher: "Ekklesia Elite Evangelical Ministry",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/imgs/ekklisa-elite.jpeg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/imgs/ekklisa-elite.jpeg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/imgs/ekklisa-elite.jpeg",
    apple: "/imgs/ekklisa-elite.jpeg",
  },
  openGraph: {
    title: "Ekklesia Elite Evangelical Ministry | Repairer of the Breach",
    description:
      "Nurturing the next generation of Christian leaders and changemakers in Ikorodu, Lagos, Nigeria. Teens & youth ministry, spiritual growth, and community outreach.",
    url: siteUrl,
    siteName: "Ekklesia Elite Evangelical Ministry",
    images: [
      {
        url: "/imgs/ekklisa-elite.jpeg",
        width: 800,
        height: 800,
        alt: "Ekklesia Elite Evangelical Ministry - Repairer of the Breach",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ekklesia Elite Evangelical Ministry | Repairer of the Breach",
    description:
      "Nurturing the next generation of Christian leaders and changemakers in Ikorodu, Lagos.",
    images: ["/imgs/ekklisa-elite.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "ekklesia elite evangelical ministry in ikorodu",
    "ekklesia elite evangelical ministry",
    "ekklesia elite",
    "ekklesia elite ikorodu",
    "ekklesia elite team",
    "ekklesia elite team in ikorodu",
    "Christian community in ikorodu",
    "repairer of the breach",
    "Christian leadership in ikorodu",
    "evangelical ministry in ikorodu",
    "teens ministry in ikorodu",
    "youth ministry in ikorodu",
    "spiritual growth",
    "community outreach in ikorodu",
    "Mojisola Olawale",
    "evangelical ministry",
    "evangelical ministry in Lagos",
    "JFFX+2QC, Lagos Rd, Ikorodu, 104101, Lagos, Nigeria",
    "church in ikorodu",
    "christian mentoring lagos",
    "teens prayer group ikorodu",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  "@id": `${siteUrl}/#church`,
  name: "Ekklesia Elite Evangelical Ministry",
  alternateName: [
    "Repairer of the Breach",
    "Ekklesia Elite",
    "Ekklesia Elite Team",
    "Ekklesia Elite Network and Evangelical Ministry",
  ],
  url: siteUrl,
  logo: `${siteUrl}/imgs/ekklisa-elite.jpeg`,
  image: `${siteUrl}/imgs/ekklisa-elite.jpeg`,
  description:
    "Ekklesia Elite Evangelical Ministry (Repairer of the Breach) is a faith-based Christian ministry in Ikorodu, Lagos, dedicated to nurturing the next generation of Christian leaders and changemakers through discipleship, moral instruction, and community outreach.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "JFFX+2QC, Lagos Rd",
    addressLocality: "Ikorodu",
    addressRegion: "Lagos",
    postalCode: "104101",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.6194,
    longitude: 3.5105,
  },
  telephone: "+2348027815383",
  founder: {
    "@type": "Person",
    name: "Mojisola Olawale",
    jobTitle: "Founder & Executive Director",
  },
  sameAs: [
    "https://www.facebook.com/share/17y7nthgXz/",
    "https://www.instagram.com/bridgerepairernetwork",
    "https://youtube.com/@kingdommatters4us",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
