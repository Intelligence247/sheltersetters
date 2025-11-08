"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroSlides = [
  {
    image: "/aluminium-roofing-installation-professional-constr.jpg",
    title: "Durable Aluminium Solutions Built for Nigeria",
    subtitle: "Production, fabrication, and installation for homes and industries since 2002",
  },
  {
    image: "/modern-window-glass-installation-office-building.jpg",
    title: "Premium Window & Glass Solutions",
    subtitle: "Custom fabrication meeting the highest architectural standards",
  },
  {
    image: "/industrial-metal-fabrication-workshop-equipment.jpg",
    title: "Expert Structural Fabrication",
    subtitle: "Precision engineering for complex industrial projects",
  },
  {
    image: "/modern-interior-office-partitions-glass-design.jpg",
    title: "Contemporary Interior Finishing",
    subtitle: "Transforming spaces with elegant design solutions",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setAutoPlay(false)
  }

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden h-screen flex items-center">
      {/* Slides Container */}
      <div className="absolute inset-0 -z-10">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(14, 41, 59, 0.8) 0%, rgba(37, 78, 99, 0.7) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl">
          <div
            key={currentSlide}
            className="animate-fade-in-up"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
            }}
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
              style={{
                animation: "slideInDown 0.8s ease-out forwards",
              }}
            >
              {heroSlides[currentSlide].title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8">{heroSlides[currentSlide].subtitle}</p>

            <p className="text-base md:text-lg text-white/80 mb-10 max-w-2xl">
              With over 20 years of expertise, Shelter Setters delivers precision craftsmanship and innovative
              architectural solutions you can trust.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: "#BD5A00",
                  color: "white",
                }}
              >
                Request Quote
                <ChevronRight className="w-5 h-5" />
              </a>
              <a
                href="tel:+234-9072629100"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 border-2"
                style={{
                  borderColor: "white",
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +234 907 262 9100
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              setAutoPlay(false)
            }}
            className="transition-all"
            style={{
              width: currentSlide === index ? "32px" : "12px",
              height: "4px",
              backgroundColor: currentSlide === index ? "#BD5A00" : "rgba(255,255,255,0.5)",
              borderRadius: "2px",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
