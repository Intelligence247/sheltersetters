"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, Clock, User, ArrowRight, Newspaper } from "lucide-react"
import Link from "next/link"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { API_BASE_URL } from "@/lib/config"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { NewsArticle } from "@/types/content"

interface NewsListResponse {
  statusCode: number
  message: string
  data?: {
    news?: NewsArticle[]
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/api/content/news`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }

        const payload: NewsListResponse = await response.json()
        const news = payload?.data?.news ?? []

        // Sort by published date (newest first)
        const sortedNews = news.sort((a, b) => {
          const dateA = new Date(a.publishedAt).getTime()
          const dateB = new Date(b.publishedAt).getTime()
          return dateB - dateA
        })

        setArticles(sortedNews)
      } catch (err) {
        console.error("Failed to load news", err)
        setError("Unable to load news at the moment.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Auto-rotate featured articles in hero section
  useEffect(() => {
    if (articles.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentArticleIndex((prev) => (prev + 1) % Math.min(articles.length, 5)) // Rotate through first 5 articles
        setIsAnimating(false)
      }, 300) // Half of transition duration
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [articles.length, isPaused])

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navigation />

      {/* Hero Section - Unique Design */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden" style={{ backgroundColor: "var(--color-primary-900)" }}>
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E293B] via-[#1a3d52] to-[#254e63]" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="pt-8 lg:pt-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fade-in-up" style={{ backgroundColor: "rgba(189, 90, 0, 0.15)" }}>
                <Newspaper className="w-4 h-4 text-[#BD5A00]" />
                <span className="text-sm font-semibold text-[#BD5A00]">Latest Updates</span>
              </div>

              {/* Main Headline */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                News & <span style={{ color: "#BD5A00" }}>Updates</span>
              </h1>

              {/* Subheading */}
              <p
                className="text-lg md:text-xl text-white/90 mb-6 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                Stay informed about our latest projects, achievements, and company milestones
              </p>

              {/* Stats */}
              {!loading && articles.length > 0 && (
                <div className="flex flex-wrap gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(189, 90, 0, 0.2)" }}>
                      <Newspaper className="w-6 h-6 text-[#BD5A00]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{articles.length}</div>
                      <div className="text-sm text-white/70">Articles</div>
                    </div>
                  </div>
                  {articles.filter(a => a.isFeatured).length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(189, 90, 0, 0.2)" }}>
                        <Calendar className="w-6 h-6 text-[#BD5A00]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{articles.filter(a => a.isFeatured).length}</div>
                        <div className="text-sm text-white/70">Featured</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <p
                className="text-base text-white/80 mb-8 animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                Discover our journey of excellence in aluminium production, fabrication, and construction across Nigeria
              </p>
            </div>

            {/* Right Content - Latest Article Preview Card with Auto-Rotation */}
            {!loading && articles.length > 0 && (
              <div className="lg:pt-12 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                <div 
                  className="card overflow-hidden group hover:shadow-2xl transition-all duration-300 relative" 
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <Link href={`/news/${articles[currentArticleIndex]._id}`}>
                    {/* Image */}
                    {articles[currentArticleIndex].imageUrl && (
                      <div className="relative h-64 overflow-hidden">
                        <img
                          key={currentArticleIndex}
                          src={articles[currentArticleIndex].imageUrl}
                          alt={articles[currentArticleIndex].altText || articles[currentArticleIndex].headline}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
                            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {articles[currentArticleIndex].isFeatured && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: "rgba(189, 90, 0, 0.9)" }}>
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div 
                        className={`flex items-center gap-3 mb-3 text-xs text-white/70 transition-all duration-500 ${
                          isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                        }`}
                      >
                        {articles[currentArticleIndex].publishedAt && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{format(new Date(articles[currentArticleIndex].publishedAt), "MMM d, yyyy")}</span>
                          </div>
                        )}
                        {articles[currentArticleIndex].readingTime && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{articles[currentArticleIndex].readingTime} min read</span>
                          </div>
                        )}
                      </div>

                      <h3 
                        className={`text-xl font-bold mb-3 text-white group-hover:text-[#BD5A00] transition-all duration-500 line-clamp-2 ${
                          isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                        }`}
                      >
                        {articles[currentArticleIndex].headline}
                      </h3>

                      <p 
                        className={`text-sm text-white/80 mb-4 line-clamp-2 transition-all duration-500 ${
                          isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                        }`}
                      >
                        {articles[currentArticleIndex].summary}
                      </p>

                      <div 
                        className={`flex items-center gap-2 text-sm font-medium text-[#BD5A00] transition-all duration-500 ${
                          isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                        }`}
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>

                  {/* Article Indicators */}
                  {articles.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                      {Array.from({ length: Math.min(articles.length, 5) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsAnimating(true)
                            setTimeout(() => {
                              setCurrentArticleIndex(index)
                              setIsAnimating(false)
                            }, 300)
                          }}
                          className={`transition-all duration-300 rounded-full ${
                            currentArticleIndex === index 
                              ? "w-8 h-2 bg-[#BD5A00]" 
                              : "w-2 h-2 bg-white/40 hover:bg-white/60"
                          }`}
                          aria-label={`Go to article ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loading State for Latest Article */}
            {loading && (
              <div className="lg:pt-12">
                <div className="card overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute lg:bottom-0 bottom-[-10px] left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 md:h-20">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--neutral-200)" />
          </svg>
        </div>
      </section>

      {/* News Articles Section */}
      <section className="section-py" style={{ backgroundColor: "var(--neutral-200)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="heading-lg mb-4">
              All News Articles
            </h2>
            <p className="body-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Explore our latest announcements, project completions, and company updates
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card overflow-hidden">
                  <Skeleton className="h-48 w-full rounded-lg mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex justify-between items-center pt-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-lg mb-4" style={{ color: "var(--text-secondary)" }}>
                {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#BD5A00] text-white hover:bg-[#a75100]"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--color-metal-500)" }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                No news articles yet
              </h3>
              <p className="body-base mb-6" style={{ color: "var(--text-secondary)" }}>
                Check back soon for the latest updates from Shelter Setters.
              </p>
              <Link href="/">
                <Button className="bg-[#BD5A00] text-white hover:bg-[#a75100]">
                  Return to Home
                </Button>
              </Link>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map((article) => {
                const publishedDate = article.publishedAt
                  ? format(new Date(article.publishedAt), "MMM d, yyyy")
                  : ""
                const readingTime = article.readingTime || 1

                return (
                  <Link
                    key={article._id}
                    href={`/news/${article._id}`}
                    className="card overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-200">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.altText || article.headline}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--color-metal-300)" }}
                        >
                          <Newspaper className="w-12 h-12" style={{ color: "var(--color-metal-500)" }} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Featured Badge */}
                      {article.isFeatured && (
                        <div className="absolute top-3 right-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: "rgba(189, 90, 0, 0.9)" }}
                          >
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-3">
                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-1">
                          {article.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: "var(--color-metal-300)",
                                color: "var(--color-primary-900)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3
                        className="font-bold text-lg md:text-xl line-clamp-2 group-hover:text-[#BD5A00] transition-colors"
                      >
                        {article.headline}
                      </h3>

                      <p
                        className="body-sm flex-1 line-clamp-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {article.summary}
                      </p>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-3 text-xs pt-2" style={{ color: "var(--neutral-500)" }}>
                        {publishedDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{publishedDate}</span>
                          </div>
                        )}
                        {article.readingTime && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{readingTime} min</span>
                          </div>
                        )}
                        {article.authorName && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{article.authorName}</span>
                          </div>
                        )}
                      </div>

                      {/* Read More Button */}
                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--color-metal-300)" }}>
                        <span
                          className="text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
                          style={{ color: "var(--color-primary-900)" }}
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Call to Action */}
          {!loading && !error && articles.length > 0 && (
            <div className="mt-16 text-center">
              <div
                className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl"
                style={{ backgroundColor: "var(--color-primary-900)" }}
              >
                <h3 className="text-2xl font-bold text-white">Stay Updated</h3>
                <p className="text-white/80 text-center max-w-md">
                  Follow our journey and get the latest updates on our projects and achievements
                </p>
                <Link href="/#contact">
                  <Button className="bg-[#BD5A00] text-white hover:bg-[#a75100]">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

