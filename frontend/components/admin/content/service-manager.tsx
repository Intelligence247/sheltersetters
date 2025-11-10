'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/admin/auth-context'
import type { ApiResponse } from '@/types/api'
import type { Service } from '@/types/content'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

interface ServiceResponse {
  services: Service[]
}

interface UpsertServiceResponse {
  service: Service
}

const initialForm: ServiceFormState = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  imageUrl: '',
  order: '',
  isActive: true,
  ctaLabel: '',
  ctaUrl: '',
}

type ServiceFormState = {
  title: string
  slug: string
  summary: string
  description?: string
  imageUrl?: string
  order: string
  isActive: boolean
  ctaLabel?: string
  ctaUrl?: string
}

export const ServiceManager = () => {
  const { request } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceFormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const response = await request<ApiResponse<ServiceResponse>>('/api/admin/content/services')
      setServices(response.data.services)
    } catch (error: any) {
      toast.error('Unable to load services', {
        description: error?.body?.message || 'Please try again shortly.',
      })
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

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
      const result = await uploadAdminImage(request, file, { folder: 'services' })
      setForm((prev) => ({ ...prev, imageUrl: result.url }))
      toast.success('Image uploaded', {
        description: 'The service image has been stored securely.',
      })
    } catch (error: any) {
      toast.error('Image upload failed', {
        description: error?.body?.message || 'Please try another image.',
      })
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const openEdit = (service: Service) => {
    setEditing(service)
    setForm({
      title: service.title,
      slug: service.slug,
      summary: service.summary,
      description: service.description ?? '',
      imageUrl: service.imageUrl ?? '',
      order: service.order !== undefined && service.order !== null ? String(service.order) : '',
      isActive: service.isActive,
      ctaLabel: service.ctaLabel ?? '',
      ctaUrl: service.ctaUrl ?? '',
    })
    setDialogOpen(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !editing
        ? {
            slug: slugify(value),
          }
        : {}),
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      summary: form.summary,
      description: form.description,
      imageUrl: form.imageUrl,
      order: form.order ? Number(form.order) : undefined,
      isActive: form.isActive,
      ctaLabel: form.ctaLabel,
      ctaUrl: form.ctaUrl,
    }

    try {
      if (editing) {
        const response = await request<ApiResponse<UpsertServiceResponse>>(
          `/api/admin/content/services/${editing._id}`,
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          }
        )
        setServices((prev) =>
          prev.map((service) => (service._id === editing._id ? response.data.service : service))
        )
        toast.success('Service updated', {
          description: `${response.data.service.title} has been saved.`,
        })
      } else {
        const response = await request<ApiResponse<UpsertServiceResponse>>('/api/admin/content/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setServices((prev) => [response.data.service, ...prev])
        toast.success('Service created', {
          description: `${response.data.service.title} is now available.`,
        })
      }
      setDialogOpen(false)
      setEditing(null)
      setForm(initialForm)
    } catch (error: any) {
      toast.error('Unable to save service', {
        description: error?.body?.message || 'Please review the details and try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(`Remove ${service.title}? This cannot be undone.`)
    if (!confirmed) return
    try {
      await request<ApiResponse<UpsertServiceResponse>>(`/api/admin/content/services/${service._id}`, {
        method: 'DELETE',
      })
      setServices((prev) => prev.filter((item) => item._id !== service._id))
      toast.success('Service deleted', {
        description: `${service.title} has been removed.`,
      })
    } catch (error: any) {
      toast.error('Unable to delete service', {
        description: error?.body?.message || 'Please try again.',
      })
    }
  }

  const orderedServices = useMemo(
    () => [...services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [services]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0E293B] dark:text-white">Services catalogue</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage the service categories displayed on the Shelter Setters website.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 bg-[#BD5A00] text-white hover:bg-[#a75100]">
              <Plus className="h-4 w-4" />
              New service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit service' : 'Create service'}</DialogTitle>
                <DialogDescription>
                  Provide the details used across the public services grid.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" value={form.slug} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={form.summary}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image</Label>
                    {form.imageUrl && (
                      <div className="overflow-hidden rounded-lg border border-slate-200">
                        <img src={form.imageUrl} alt="Service visual" className="h-36 w-full object-cover" />
                      </div>
                    )}
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
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
                      Upload a new asset or paste an existing URL. Images are hosted via Cloudinary.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Display order</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      value={form.order}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaLabel">CTA label</Label>
                    <Input id="ctaLabel" name="ctaLabel" value={form.ctaLabel} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaUrl">CTA URL</Label>
                    <Input id="ctaUrl" name="ctaUrl" value={form.ctaUrl} onChange={handleChange} />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div>
                    <p className="font-medium text-[#0E293B] dark:text-white">Active</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Toggle to show or hide this service on the public site.
                    </p>
                  </div>
                  <Switch checked={form.isActive} onCheckedChange={(value) => setForm((prev) => ({ ...prev, isActive: value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="bg-[#BD5A00] text-white hover:bg-[#a75100]">
                  {submitting ? 'Saving…' : 'Save service'}
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
              <TableHead>Title</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && orderedServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                  No services added yet.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading services…
                </TableCell>
              </TableRow>
            )}
            {orderedServices.map((service) => (
              <TableRow key={service._id}>
                <TableCell className="font-semibold text-[#0E293B] dark:text-white">{service.title}</TableCell>
                <TableCell className="max-w-[320px] truncate text-slate-500 dark:text-slate-400">
                  {service.summary}
                </TableCell>
                <TableCell>{service.order ?? '-'}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      service.isActive
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                        : 'border-slate-300/40 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }
                  >
                    {service.isActive ? 'Active' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(service)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(service)}
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

