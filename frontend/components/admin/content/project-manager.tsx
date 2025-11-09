'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/admin/auth-context'
import type { ApiResponse } from '@/types/api'
import type { Project } from '@/types/content'
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

interface ProjectListResponse {
  projects: Project[]
}

interface ProjectItemResponse {
  project: Project
}

type ProjectFormState = {
  title: string
  slug: string
  summary: string
  description: string
  category: string
  location: string
  imageUrl: string
  gallery: string
  metrics: string
  completedAt: string
  order: string
  isFeatured: boolean
}

const initialForm: ProjectFormState = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  category: '',
  location: '',
  imageUrl: '',
  gallery: '',
  metrics: '',
  completedAt: '',
  order: '',
  isFeatured: true,
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toDateInput = (iso?: string) => {
  if (!iso) return ''
  const date = new Date(iso)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 10)
}

const fromDateInput = (value: string) => {
  if (!value) return undefined
  const date = new Date(value)
  return date.toISOString()
}

export const ProjectManager = () => {
  const { request } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<ProjectFormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const response = await request<ApiResponse<ProjectListResponse>>('/api/admin/content/projects')
      setProjects(response.data.projects)
    } catch (error: any) {
      toast.error('Unable to load projects', {
        description: error?.body?.message || 'Please try again shortly.',
      })
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const openCreate = () => {
    setEditing(null)
    setForm(initialForm)
    setDialogOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditing(project)
    setForm({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description ?? '',
      category: project.category ?? '',
      location: project.location ?? '',
      imageUrl: project.imageUrl ?? '',
      gallery: (project.gallery ?? []).join(', '),
      metrics: project.metrics
        ? Object.entries(project.metrics)
            .map(([key, value]) => `${key}:${value}`)
            .join(', ')
        : '',
      completedAt: toDateInput(project.completedAt),
      order: project.order !== undefined && project.order !== null ? String(project.order) : '',
      isFeatured: project.isFeatured,
    })
    setDialogOpen(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !editing ? { slug: slugify(value) } : {}),
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
      category: form.category,
      location: form.location,
      imageUrl: form.imageUrl,
      gallery: form.gallery
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      metrics: form.metrics
        ? form.metrics.split(',').reduce<Record<string, string>>((acc, pair) => {
            const [key, value] = pair.split(':').map((item) => item.trim())
            if (key && value) acc[key] = value
            return acc
          }, {})
        : undefined,
      completedAt: fromDateInput(form.completedAt),
      order: form.order ? Number(form.order) : undefined,
      isFeatured: form.isFeatured,
    }

    try {
      if (editing) {
        const response = await request<ApiResponse<ProjectItemResponse>>(
          `/api/admin/content/projects/${editing._id}`,
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          }
        )
        setProjects((prev) =>
          prev.map((project) => (project._id === editing._id ? response.data.project : project))
        )
        toast.success('Project updated', {
          description: `${response.data.project.title} has been saved.`,
        })
      } else {
        const response = await request<ApiResponse<ProjectItemResponse>>('/api/admin/content/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setProjects((prev) => [response.data.project, ...prev])
        toast.success('Project created', {
          description: `${response.data.project.title} is now featured.`,
        })
      }
      setDialogOpen(false)
      setEditing(null)
      setForm(initialForm)
    } catch (error: any) {
      toast.error('Unable to save project', {
        description: error?.body?.message || 'Please review the details and try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(`Remove project "${project.title}"? This cannot be undone.`)
    if (!confirmed) return
    try {
      await request<ApiResponse<ProjectItemResponse>>(`/api/admin/content/projects/${project._id}`, {
        method: 'DELETE',
      })
      setProjects((prev) => prev.filter((item) => item._id !== project._id))
      toast.success('Project deleted', {
        description: `${project.title} has been removed.`,
      })
    } catch (error: any) {
      toast.error('Unable to delete project', {
        description: error?.body?.message || 'Please try again.',
      })
    }
  }

  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [projects]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0E293B] dark:text-white">Featured projects</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showcase key builds, installations, and project highlights for prospective clients.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 bg-[#BD5A00] text-white hover:bg-[#a75100]">
              <Plus className="h-4 w-4" />
              New project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit project' : 'Create project'}</DialogTitle>
                <DialogDescription>
                  Provide details about the project scope, location, and outcomes.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={form.slug} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Display order</Label>
                    <Input id="order" name="order" type="number" value={form.order} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea id="summary" name="summary" value={form.summary} onChange={handleChange} rows={3} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Project scope, materials used, client benefits…"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" value={form.category} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={form.location} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Hero image URL</Label>
                    <Input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completedAt">Completion date</Label>
                    <Input
                      id="completedAt"
                      name="completedAt"
                      type="date"
                      value={form.completedAt}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gallery">Gallery images</Label>
                    <Input
                      id="gallery"
                      name="gallery"
                      value={form.gallery}
                      onChange={handleChange}
                      placeholder="Comma separated URLs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metrics">Key metrics</Label>
                    <Input
                      id="metrics"
                      name="metrics"
                      value={form.metrics}
                      onChange={handleChange}
                      placeholder="Format: key:value, key2:value2"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div>
                    <p className="font-medium text-[#0E293B] dark:text-white">Feature on homepage</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Toggle visibility within the featured projects carousel.
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
                  {submitting ? 'Saving…' : editing ? 'Save changes' : 'Create project'}
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
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && orderedProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                  No projects recorded yet.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading projects…
                </TableCell>
              </TableRow>
            )}
            {orderedProjects.map((project) => (
              <TableRow key={project._id}>
                <TableCell className="font-semibold text-[#0E293B] dark:text-white">{project.title}</TableCell>
                <TableCell className="text-slate-500 dark:text-slate-400">{project.category ?? '-'}</TableCell>
                <TableCell className="text-slate-500 dark:text-slate-400">{project.location ?? '-'}</TableCell>
                <TableCell>
                  {project.isFeatured ? (
                    <Badge variant="outline" className="border-[#BD5A00]/20 bg-[#BD5A00]/10 text-[#BD5A00]">
                      Featured
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-300/40 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Archived
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(project)}
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

