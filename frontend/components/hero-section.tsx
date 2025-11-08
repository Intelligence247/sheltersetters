"use client"

import Link from "next/link"
import { Phone, ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/shelter-setters-workers-installing-aluminium-roofi.jpg"
          alt="Shelter Setters workers installing aluminium roofing sheets on a building in Ilorin"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(14, 41, 59, 0.85)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Main Headline */}
          <h1 className="heading-xl mb-6 text-white animate-fade-in-up">
            Durable Aluminium Solutions Built for Nigeria
          </h1>

          {/* Subheading */}
          <p className="body-lg mb-8 text-white/90 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Production, fabrication, and installation for homes and industries since 2002
          </p>

          {/* Description */}
          <p className="text-lg text-white/80 mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            With over 20 years of expertise, Shelter Setters delivers precision craftsmanship and innovative
            architectural solutions you can trust.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="#contact" className="btn-primary inline-flex items-center justify-center gap-2">
              Request Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+234-9072629100" className="btn-secondary inline-flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call Now: +234 907 262 9100
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
