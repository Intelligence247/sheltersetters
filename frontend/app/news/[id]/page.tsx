"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Clock, User, Tag } from "lucide-react"
import Link from "next/link"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { API_BASE_URL } from "@/lib/config"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { NewsArticle } from "@/types/content"

interface NewsArticleResponse {
  statusCode: number
  message: string
  data?: {
    article?: NewsArticle
  }
}

export default function NewsArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/api/content/news/${params.id}`, {
          cache: "no-store",
        })

        if (!response.ok) {
          if (response.status === 404) {
            setError("Article not found")
          } else {
            throw new Error("Failed to fetch article")
          }
          return
        }

        const payload: NewsArticleResponse = await response.json()
        if (payload.data?.article) {
          setArticle(payload.data.article)
        } else {
          setError("Article not found")
        }
      } catch (err) {
        console.error("Failed to load article", err)
        setError("Unable to load article at the moment.")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  if (loading) {
    return (
      <main style={{ minHeight: "100vh" }}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !article) {
    return (
      <main style={{ minHeight: "100vh" }}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {error || "Article not found"}
            </h1>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="bg-[#BD5A00] text-white hover:bg-[#a75100]">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const publishedDate = article.publishedAt ? format(new Date(article.publishedAt), "MMMM d, yyyy") : ""
  const readingTime = article.readingTime || 1

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navigation />
      <article className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 pt-28">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>

        {/* Header */}
        <header className="mb-8">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
          >
            {article.headline}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            {publishedDate && (
              <div className="flex items-center gap-2">
                <span>{publishedDate}</span>
              </div>
            )}
            {article.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            )}
            {article.authorName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.authorName}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "var(--color-metal-300)",
                    color: "var(--color-primary-900)",
                  }}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {article.summary}
            </p>
          )}
        </header>

        {/* Hero Image */}
        {article.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.altText || article.headline}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Body Content */}
        {article.body && (
          <div
            className="prose prose-lg max-w-none mb-8"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <div
              className="whitespace-pre-wrap leading-relaxed"
              style={{
                fontSize: "1.125rem",
                lineHeight: "1.75rem",
              }}
            >
              {article.body.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-primary-900)" }}>
              Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.gallery.map((item, index) => (
                <div key={index} className="rounded-xl overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt || `${article.headline} - Image ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-8 border-t" style={{ borderColor: "var(--color-metal-300)" }}>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
            <Link href="/">
              <Button className="bg-[#BD5A00] text-white hover:bg-[#a75100]">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}

