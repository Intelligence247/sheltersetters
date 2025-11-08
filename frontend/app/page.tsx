"use client"
import Navigation from "@/components/navigation"
import HeroCarousel from "@/components/hero-carousel"
import NewsBanner from "@/components/news-banner"
import CoreValues from "@/components/core-values"
import WhyChooseUs from "@/components/why-choose-us"
import ServicesGrid from "@/components/services-grid"
import ProductCatalog from "@/components/product-catalog"
import IndustriesServed from "@/components/industries-served"
import FeaturedProjects from "@/components/featured-projects"
import QualityAndSafety from "@/components/quality-and-safety"
import OurTeam from "@/components/our-team"
import CSRSection from "@/components/csr-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navigation />
      <HeroCarousel />
      <NewsBanner />
      <CoreValues />
      <WhyChooseUs />
      <ServicesGrid />
      <ProductCatalog />
      <IndustriesServed />
      <FeaturedProjects />
      <QualityAndSafety />
      <OurTeam />
      <CSRSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
