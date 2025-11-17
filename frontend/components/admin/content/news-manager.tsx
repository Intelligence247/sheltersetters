'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarHeart, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/admin/auth-context'
import type { ApiResponse } from '@/types/api'
import type { NewsArticle } from '@/types/content'
import { uploadAdminImage } from '@/lib/uploads'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface NewsListResponse {
  news: NewsArticle[]
}

interface NewsItemResponse {
  article: NewsArticle
}

type NewsFormState = {
  headline: string
  summary: string
  body: string
  imageUrl: string
  altText: string
  gallery: Array<{ url: string; alt: string }>
  authorName: string
  publishedAt: string
  isFeatured: boolean
  tags: string
}

const initialForm: NewsFormState = {
  headline: '',
  summary: '',
  body: '',
  imageUrl: '',
  altText: '',
  gallery: [],
  authorName: '',
  publishedAt: '',
  isFeatured: false,
  tags: '',
}

const toDateTimeLocal = (iso?: string) => {
  if (!iso) return ''
  const date = new Date(iso)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

const fromDateTimeLocal = (value: string) => {
  if (!value) return new Date().toISOString()
  const date = new Date(value)
  return date.toISOString()
}

export const NewsManager = () => {
  const { request } = useAuth()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<NewsArticle | null>(null)
  const [form, setForm] = useState<NewsFormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      const response = await request<ApiResponse<NewsListResponse>>('/api/admin/content/news')
      setArticles(response.data.news)
    } catch (error: any) {
      toast.error('Unable to load news articles', {
        description: error?.body?.message || 'Please try again shortly.',
      })
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const openCreate = () => {
    setEditing(null)
    setForm(initialForm)
    setDialogOpen(true)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const result = await uploadAdminImage(request, file, { folder: 'news' })
      setForm((prev) => ({ ...prev, imageUrl: result.url }))
      toast.success('Image uploaded', {
        description: 'The hero image is ready to use.',
      })
    } catch (error: any) {
      toast.error('Image upload failed', {
        description: error?.body?.message || 'Please try again shortly.',
      })
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    setUploadingGallery(true)
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadAdminImage(request, file, { folder: 'news' })
      )
      const results = await Promise.all(uploadPromises)
      const newGalleryItems = results.map((result) => ({
        url: result.url,
        alt: '',
      }))
      setForm((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newGalleryItems],
      }))
      toast.success('Gallery images uploaded', {
        description: `${results.length} image(s) added to gallery.`,
      })
    } catch (error: any) {
      toast.error('Gallery upload failed', {
        description: error?.body?.message || 'Please try again shortly.',
      })
    } finally {
      setUploadingGallery(false)
      event.target.value = ''
    }
  }

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const updateGalleryAlt = (index: number, alt: string) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item, i) => (i === index ? { ...item, alt } : item)),
    }))
  }

  const openEdit = (article: NewsArticle) => {
    setEditing(article)
    setForm({
      headline: article.headline,
      summary: article.summary,
      body: article.body ?? '',
      imageUrl: article.imageUrl ?? '',
      altText: article.altText ?? '',
      gallery: article.gallery ?? [],
      authorName: article.authorName ?? '',
      publishedAt: toDateTimeLocal(article.publishedAt),
      isFeatured: article.isFeatured,
      tags: (article.tags ?? []).join(', '),
    })
    setDialogOpen(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    const payload = {
      headline: form.headline,
      summary: form.summary,
      body: form.body,
      imageUrl: form.imageUrl,
      altText: form.altText,
      gallery: form.gallery.filter((item) => item.url.trim() !== ''),
      authorName: form.authorName,
      publishedAt: fromDateTimeLocal(form.publishedAt || new Date().toISOString()),
      isFeatured: form.isFeatured,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    try {
      if (editing) {
        const response = await request<ApiResponse<NewsItemResponse>>(
          `/api/admin/content/news/${editing._id}`,
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          }
        )
        setArticles((prev) =>
          prev.map((article) => (article._id === editing._id ? response.data.article : article))
        )
        toast.success('Article updated', {
          description: `${response.data.article.headline} has been saved.`,
        })
      } else {
        const response = await request<ApiResponse<NewsItemResponse>>('/api/admin/content/news', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setArticles((prev) => [response.data.article, ...prev])
        toast.success('Article published', {
          description: `${response.data.article.headline} is now live.`,
        })
      }
      setDialogOpen(false)
      setEditing(null)
      setForm(initialForm)
    } catch (error: any) {
      toast.error('Unable to save article', {
        description: error?.body?.message || 'Please review the details and try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (article: NewsArticle) => {
    const confirmed = window.confirm(`Delete "${article.headline}"? This cannot be undone.`)
    if (!confirmed) return
    try {
      await request<ApiResponse<NewsItemResponse>>(`/api/admin/content/news/${article._id}`, {
        method: 'DELETE',
      })
      setArticles((prev) => prev.filter((item) => item._id !== article._id))
      toast.success('Article deleted', {
        description: `${article.headline} has been removed.`,
      })
    } catch (error: any) {
      toast.error('Unable to delete article', {
        description: error?.body?.message || 'Please try again.',
      })
    }
  }

  const sortedArticles = useMemo(
    () =>
      [...articles].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    [articles]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0E293B] dark:text-white">News & updates</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Publish announcements to keep clients informed about Shelter Setters milestones.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 bg-[#BD5A00] text-white hover:bg-[#a75100]">
              <Plus className="h-4 w-4" />
              New article
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit article' : 'Publish article'}</DialogTitle>
                <DialogDescription>
                  Use compelling headlines and summaries to highlight recent achievements.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input id="headline" name="headline" value={form.headline} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea id="summary" name="summary" value={form.summary} onChange={handleChange} rows={3} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">
                    Full article body
                    <span className="text-xs text-slate-500 ml-2">(This will be displayed on the detailed article page)</span>
                  </Label>
                  <Textarea
                    id="body"
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    placeholder="Write the full detailed story here. This content will be shown when users click 'Read More' on the article..."
                    rows={8}
                    className="resize-y"
                  />
                  <p className="text-xs text-slate-500">
                    The body content is displayed on the detailed article page. You can use multiple paragraphs by separating them with line breaks.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Feature image</Label>
                    {form.imageUrl && (
                      <div className="overflow-hidden rounded-lg border border-slate-200">
                        <img src={form.imageUrl} alt={form.altText || form.headline} className="h-36 w-full object-cover" />
                      </div>
                    )}
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://"
                    />
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                      {uploadingImage && <Loader2 className="h-4 w-4 animate-spin text-[#BD5A00]" />}
                    </div>
                    <p className="text-xs text-slate-500">
                      Upload a new image or paste an existing URL from your media library.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altText">Image alt text</Label>
                    <Input id="altText" name="altText" value={form.altText} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt">Publish date</Label>
                    <Input
                      id="publishedAt"
                      name="publishedAt"
                      type="datetime-local"
                      value={form.publishedAt}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="Separate tags with commas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorName">Author name</Label>
                    <Input
                      id="authorName"
                      name="authorName"
                      value={form.authorName}
                      onChange={handleChange}
                      placeholder="Article author"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Gallery images</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      disabled={uploadingGallery}
                    />
                    {uploadingGallery && <Loader2 className="h-4 w-4 animate-spin text-[#BD5A00]" />}
                  </div>
                  <p className="text-xs text-slate-500">
                    Upload multiple images to create a gallery for the article.
                  </p>
                  {form.gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {form.gallery.map((item, index) => (
                        <div key={index} className="relative group">
                          <div className="overflow-hidden rounded-lg border border-slate-200">
                            <img src={item.url} alt={item.alt || `Gallery image ${index + 1}`} className="h-32 w-full object-cover" />
                          </div>
                          <div className="mt-2 space-y-1">
                            <Input
                              placeholder="Alt text"
                              value={item.alt}
                              onChange={(e) => updateGalleryAlt(index, e.target.value)}
                              className="text-xs"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 bg-red-500 hover:bg-red-600 text-white border-0"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div>
                    <p className="font-medium text-[#0E293B] dark:text-white">Feature on homepage</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Display this article prominently on the main site.
                    </p>
                  </div>
                  <Switch
                    checked={form.isFeatured}
                    onCheckedChange={(value) => setForm((prev) => ({ ...prev, isFeatured: value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="bg-[#BD5A00] text-white hover:bg-[#a75100]">
                  {submitting ? 'Saving…' : editing ? 'Save changes' : 'Publish article'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Headline</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && sortedArticles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                  No news articles published yet.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading articles…
                </TableCell>
              </TableRow>
            )}
            {sortedArticles.map((article) => (
              <TableRow key={article._id}>
                <TableCell className="font-semibold text-[#0E293B] dark:text-white">{article.headline}</TableCell>
                <TableCell className="max-w-[320px] truncate text-slate-500 dark:text-slate-400">
                  {article.summary}
                </TableCell>
                <TableCell className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarHeart className="h-3 w-3 text-[#BD5A00]" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {article.isFeatured ? (
                    <Badge variant="outline" className="border-[#BD5A00]/20 bg-[#BD5A00]/10 text-[#BD5A00]">
                      Featured
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-300/40 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Standard
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(article)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(article)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

