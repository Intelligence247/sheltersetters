"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { API_BASE_URL } from "@/lib/config"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsItem {
  id: string
  headline: string
  summary: string
  date: string
  image: string
  alt: string
}

interface NewsApiResponse {
  statusCode: number
  message: string
  data?: {
    news?: NewsArticleApi[]
  }
}

interface NewsArticleApi {
  _id?: string
  id?: string | number
  headline: string
  summary: string
  imageUrl?: string
  altText?: string
  publishedAt?: string
  createdAt?: string
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "1",
    headline: "New State-of-the-Art Fabrication Facility Opens",
    summary:
      "Shelter Setters inaugurates advanced production facility in Ilorin with cutting-edge machinery and equipment.",
    date: "Dec 15, 2024",
    image: "/industrial-metal-fabrication-workshop-equipment.jpg",
    alt: "Shelter Setters engineers installing aluminium roofing, Ilorin.",
  },
  {
    id: "2",
    headline: "Completed Premium Office Complex in Lagos",
    summary: "Successfully delivered glass partitioning and aluminium framework for a major corporate headquarters.",
    date: "Dec 10, 2024",
    image: "/modern-interior-office-partitions-glass-design.jpg",
    alt: "Newly completed office complex with modern partitions.",
  },
  {
    id: "3",
    headline: "Community Skill Development Program Launched",
    summary: "Initiated apprenticeship program to train youth in aluminium fabrication and construction techniques.",
    date: "Dec 5, 2024",
    image: "/aluminium-roofing-installation-professional-constr.jpg",
    alt: "CSR activity - workers participating in skill development.",
  },
]

export default function NewsBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadNews = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/api/content/news`, {
          signal: controller.signal,
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }

        const payload: NewsApiResponse = await response.json()
        const news = payload?.data?.news ?? []

        const formattedNews: NewsItem[] = news.map((item, index) => {
          const id = String(item._id ?? item.id ?? index)
          const dateSource = item.publishedAt ?? item.createdAt
          const formattedDate = dateSource ? format(new Date(dateSource), "MMM d, yyyy") : ""

          return {
            id,
            headline: item.headline,
            summary: item.summary,
            date: formattedDate,
            image: item.imageUrl || "/placeholder.svg",
            alt: item.altText || item.headline,
          }
        })

        if (!formattedNews.length) {
          setNewsItems(FALLBACK_NEWS)
        } else {
          setNewsItems(formattedNews)
        }
      } catch (err) {
        console.error("Failed to load news", err)
        setError("Unable to load news at the moment.")
        setNewsItems(FALLBACK_NEWS)
      } finally {
        setLoading(false)
      }
    }

    loadNews()

    return () => {
      controller.abort()
    }
  }, [])

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (isDismissed || isHovering || loading || newsItems.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isDismissed, isHovering, loading, newsItems.length])

  useEffect(() => {
    setCurrentIndex(0)
  }, [newsItems.length])

  const goToPrevious = () => {
    if (newsItems.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)
  }

  const goToNext = () => {
    if (newsItems.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % newsItems.length)
  }

  const goToSlide = (index: number) => {
    if (newsItems.length === 0) return
    setCurrentIndex(index)
  }

  if (isDismissed) return null

  const skeletonCount = isMobile ? 1 : 3

  // Get items to display (1 on mobile, up to 3 on desktop)
  const itemsToShow = Math.min(isMobile ? 1 : 3, newsItems.length || (isMobile ? 1 : 3))
  const displayItems: NewsItem[] = []
  if (newsItems.length > 0) {
    for (let i = 0; i < itemsToShow; i++) {
      displayItems.push(newsItems[(currentIndex + i) % newsItems.length])
    }
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
            <h2 className="news-header heading-lg mb-2">
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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <article key={index} className="card overflow-hidden">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <div className="mt-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex justify-between items-center pt-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
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
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
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
                        className={cn(
                          "btn-primary text-sm py-1 px-3",
                          "disabled:opacity-60 disabled:pointer-events-none"
                        )}
                        aria-label={`Read more about ${item.headline}`}
                        tabIndex={-1}
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full transition-all duration-300 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:pointer-events-none"
              style={{
                backgroundColor: "white",
                color: "var(--color-primary-900)",
                border: `2px solid var(--color-metal-300)`,
              }}
              disabled={loading || newsItems.length <= 1}
              aria-label="Previous news items"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {!loading && newsItems.length > 0 && (
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
            )}

            {loading && (
              <div className="flex gap-2">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <Skeleton key={index} className="h-2 w-6 rounded-full" />
                ))}
              </div>
            )}

            <button
              onClick={goToNext}
              className="p-2 rounded-full transition-all duration-300 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:pointer-events-none"
              style={{
                backgroundColor: "white",
                color: "var(--color-primary-900)",
                border: `2px solid var(--color-metal-300)`,
              }}
              disabled={loading || newsItems.length <= 1}
              aria-label="Next news items"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <p className="text-center mt-4 text-sm" style={{ color: "var(--neutral-600)" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
