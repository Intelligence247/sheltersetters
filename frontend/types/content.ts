export interface Service {
  _id: string
  title: string
  slug: string
  summary: string
  description?: string
  icon?: string
  imageUrl?: string
  order?: number
  isActive: boolean
  ctaLabel?: string
  ctaUrl?: string
  createdAt: string
  updatedAt: string
}

export interface NewsArticle {
  _id: string
  headline: string
  summary: string
  body?: string
  imageUrl?: string
  altText?: string
  publishedAt: string
  isFeatured: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Project {
  _id: string
  title: string
  slug: string
  summary: string
  description?: string
  category?: string
  location?: string
  imageUrl?: string
  gallery?: string[]
  metrics?: Record<string, string>
  completedAt?: string
  order?: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  _id: string
  name: string
  role: string
  bio?: string
  imageUrl?: string
  order?: number
  socialLinks?: { platform?: string; url?: string }[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

