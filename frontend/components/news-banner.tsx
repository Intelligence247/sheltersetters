"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface NewsItem {
  id: number
  headline: string
  summary: string
  date: string
  image: string
  alt: string
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    headline: "New State-of-the-Art Fabrication Facility Opens",
    summary:
      "Shelter Setters inaugurates advanced production facility in Ilorin with cutting-edge machinery and equipment.",
    date: "Dec 15, 2024",
    image: "/industrial-metal-fabrication-workshop-equipment.jpg",
    alt: "Shelter Setters engineers installing aluminium roofing, Ilorin.",
  },
  {
    id: 2,
    headline: "Completed Premium Office Complex in Lagos",
    summary: "Successfully delivered glass partitioning and aluminium framework for a major corporate headquarters.",
    date: "Dec 10, 2024",
    image: "/modern-interior-office-partitions-glass-design.jpg",
    alt: "Newly completed office complex with modern partitions.",
  },
  {
    id: 3,
    headline: "Community Skill Development Program Launched",
    summary: "Initiated apprenticeship program to train youth in aluminium fabrication and construction techniques.",
    date: "Dec 5, 2024",
    image: "/aluminium-roofing-installation-professional-constr.jpg",
    alt: "CSR activity - workers participating in skill development.",
  },
  {
    id: 4,
    headline: "Award for Excellence in Manufacturing",
    summary: "Recognized for maintaining highest quality standards in roofing sheet production across Nigeria.",
    date: "Nov 28, 2024",
    image: "/modern-window-glass-installation-office-building.jpg",
    alt: "Award ceremony recognizing manufacturing excellence.",
  },
  {
    id: 5,
    headline: "Expanded Distribution Network Nationwide",
    summary: "New regional offices established in Port Harcourt, Abuja, and Kano for faster customer service.",
    date: "Nov 20, 2024",
    image: "/industrial-metal-fabrication-workshop-equipment.jpg",
    alt: "Distribution network expansion announcement.",
  },
]

export default function NewsBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Auto-rotate carousel
  useEffect(() => {
    if (isDismissed || isHovering) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isDismissed, isHovering])

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (isDismissed) return null

  // Get items to display (1 on mobile, 3 on desktop)
  const itemsToShow = isMobile ? 1 : 3
  const displayItems = []
  for (let i = 0; i < itemsToShow; i++) {
    displayItems.push(newsItems[(currentIndex + i) % newsItems.length])
  }

  return (
    <section
      className="w-full section-py transition-colors duration-300"
      style={{
        backgroundColor: "var(--neutral-200)",
      }}
      aria-label="Company news and updates"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 md:mb-12">
          <div>
            <h2 className="heading-lg mb-2" style={{ color: "var(--color-primary-900)" }}>
              Latest News & Updates
            </h2>
            <p className="body-base" style={{ color: "var(--text-secondary)" }}>
              Stay informed about Shelter Setters' latest projects, achievements, and company milestones
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-lg transition-colors hover:bg-white"
            style={{
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
            }}
            aria-label="Dismiss news banner"
            title="Dismiss this section"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Container */}
        <div
          className="relative rounded-xl overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-live="polite"
          aria-label="News carousel"
        >
          {/* News Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {displayItems.map((item, index) => (
              <article
                key={item.id}
                className="card overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => goToSlide((currentIndex + index) % newsItems.length)}
              >
                {/* Image Container */}
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-3">
                  <h3
                    className="font-bold text-base md:text-lg line-clamp-2 group-hover:text-[#BD5A00] transition-colors"
                    style={{ color: "var(--color-primary-900)" }}
                  >
                    {item.headline}
                  </h3>

                  <p className="body-sm flex-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {item.summary}
                  </p>

                  <div
                    className="flex justify-between items-center pt-3 border-t"
                    style={{ borderColor: "var(--color-metal-300)" }}
                  >
                    <span className="body-sm" style={{ color: "var(--neutral-500)" }}>
                      {item.date}
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      className="btn-primary text-sm py-1 px-3"
                      aria-label={`Read more about ${item.headline}`}
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full transition-all duration-300 hover:bg-white hover:shadow-md"
              style={{
                backgroundColor: "white",
                color: "var(--color-primary-900)",
                border: `2px solid var(--color-metal-300)`,
              }}
              aria-label="Previous news items"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Indicator Dots */}
            <div className="flex gap-2" role="tablist" aria-label="News carousel pagination">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: index === currentIndex ? "var(--color-primary-900)" : "var(--color-metal-300)",
                    cursor: "pointer",
                    width: index === currentIndex ? "24px" : "8px",
                  }}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to news item ${index + 1}`}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              className="p-2 rounded-full transition-all duration-300 hover:bg-white hover:shadow-md"
              style={{
                backgroundColor: "white",
                color: "var(--color-primary-900)",
                border: `2px solid var(--color-metal-300)`,
              }}
              aria-label="Next news items"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
