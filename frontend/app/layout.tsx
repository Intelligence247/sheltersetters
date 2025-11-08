import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ThemeToggle from "@/components/theme-toggle"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Shelter Setters | Premium Aluminium & Roofing Solutions in Nigeria",
  description:
    "Expert aluminium production, roofing sheets, window fabrication, and building finishing services. Over 20 years of excellence serving Nigeria. ISO certified quality guaranteed.",
  keywords:
    "aluminium, roofing sheets, fabrication, installation, Nigeria, Ilorin, construction, window fabrication, glass partitions, building finishing",
  applicationName: "Shelter Setters",
  authors: [{ name: "Shelter Setters Aluminium and Experts Nig. Ltd" }],
  creator: "Shelter Setters",
  publisher: "Shelter Setters",
  metadataBase: new URL("https://sheltersetters.com"),
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    url: "https://sheltersetters.com",
    title: "Shelter Setters | Premium Aluminium & Roofing Solutions",
    description: "Expert aluminium and roofing solutions since 2002. Trusted by Nigeria's leading developers.",
    siteName: "Shelter Setters",
    images: [
      {
        url: "/aluminium-roofing-professional.jpg",
        width: 1200,
        height: 1200,
        alt: "Shelter Setters Professional Aluminium Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelter Setters | Premium Aluminium & Roofing Solutions",
    description: "Expert aluminium and roofing solutions since 2002. Trusted by Nigeria's leading developers.",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://sheltersetters.com",
  },
  generator: "v0.app",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Shelter Setters Aluminium and Experts Nig. Ltd",
              image: "https://sheltersetters.com/logo.png",
              description:
                "Premium aluminium production, roofing sheets, window fabrication, and building finishing services",
              url: "https://sheltersetters.com",
              telephone: "+234-9072629100",
              email: "info.ssaeltd@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Plot 4/6 Shelter Setters Street, Off Hajj Camp Road",
                addressLocality: "Ilorin",
                addressRegion: "Kwara State",
                postalCode: "240103",
                addressCountry: "NG",
              },
              priceRange: "$$",
              areaServed: "NG",
              foundingDate: "2002",
              sameAs: [
                "https://www.facebook.com/sheltersetters",
                "https://www.twitter.com/sheltersetters",
                "https://www.linkedin.com/company/sheltersetters",
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "156",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Shelter Setters Aluminium and Experts Nig. Ltd",
              description: "Premium aluminium and roofing solutions provider",
              url: "https://sheltersetters.com",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                telephone: "+234-9072629100",
              },
            }),
          }}
        />
      </head>
      <body style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {children}
        <ThemeToggle />
        <Analytics />
      </body>
    </html>
  )
}
