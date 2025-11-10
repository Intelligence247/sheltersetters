'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/admin/auth-context'
import type { ApiResponse } from '@/types/api'
import type { TeamMember } from '@/types/content'
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

interface TeamListResponse {
  members: TeamMember[]
}

interface TeamItemResponse {
  member: TeamMember
}

type TeamFormState = {
  name: string
  role: string
  bio: string
  imageUrl: string
  order: string
  isActive: boolean
  socialLinks: string
}

const initialForm: TeamFormState = {
  name: '',
  role: '',
  bio: '',
  imageUrl: '',
  order: '',
  isActive: true,
  socialLinks: '',
}

export const TeamManager = () => {
  const { request } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState<TeamFormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await request<ApiResponse<TeamListResponse>>('/api/admin/content/team')
      setMembers(response.data.members)
    } catch (error: any) {
      toast.error('Unable to load team members', {
        description: error?.body?.message || 'Please try again shortly.',
      })
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

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
      const result = await uploadAdminImage(request, file, { folder: 'team' })
      setForm((prev) => ({ ...prev, imageUrl: result.url }))
      toast.success('Profile image uploaded', {
        description: 'The image is ready to appear on the leadership page.',
      })
    } catch (error: any) {
      toast.error('Image upload failed', {
        description: error?.body?.message || 'Please try another file.',
      })
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const openEdit = (member: TeamMember) => {
    setEditing(member)
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio ?? '',
      imageUrl: member.imageUrl ?? '',
      order: member.order !== undefined && member.order !== null ? String(member.order) : '',
      isActive: member.isActive,
      socialLinks: (member.socialLinks ?? [])
        .map(({ platform, url }) => [platform ?? '', url ?? ''].join('|'))
        .join(', '),
    })
    setDialogOpen(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const parseSocialLinks = (input: string) =>
    input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((pair) => {
        const [platform, url] = pair.split('|').map((value) => value.trim())
        return { platform, url }
      })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    const payload = {
      name: form.name,
      role: form.role,
      bio: form.bio,
      imageUrl: form.imageUrl,
      order: form.order ? Number(form.order) : undefined,
      isActive: form.isActive,
      socialLinks: parseSocialLinks(form.socialLinks),
    }

    try {
      if (editing) {
        const response = await request<ApiResponse<TeamItemResponse>>(
          `/api/admin/content/team/${editing._id}`,
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          }
        )
        setMembers((prev) =>
          prev.map((member) => (member._id === editing._id ? response.data.member : member))
        )
        toast.success('Team member updated', {
          description: `${response.data.member.name} has been saved.`,
        })
      } else {
        const response = await request<ApiResponse<TeamItemResponse>>('/api/admin/content/team', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMembers((prev) => [response.data.member, ...prev])
        toast.success('Team member added', {
          description: `${response.data.member.name} is now displayed on the site.`,
        })
      }
      setDialogOpen(false)
      setEditing(null)
      setForm(initialForm)
    } catch (error: any) {
      toast.error('Unable to save team member', {
        description: error?.body?.message || 'Please review the details and try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (member: TeamMember) => {
    const confirmed = window.confirm(`Remove ${member.name}? This cannot be undone.`)
    if (!confirmed) return
    try {
      await request<ApiResponse<TeamItemResponse>>(`/api/admin/content/team/${member._id}`, {
        method: 'DELETE',
      })
      setMembers((prev) => prev.filter((item) => item._id !== member._id))
      toast.success('Team member deleted', {
        description: `${member.name} has been removed.`,
      })
    } catch (error: any) {
      toast.error('Unable to delete team member', {
        description: error?.body?.message || 'Please try again.',
      })
    }
  }

  const orderedMembers = useMemo(
    () => [...members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [members]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0E293B] dark:text-white">Leadership & team</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Maintain biographies and profiles for the Shelter Setters leadership and management team.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 bg-[#BD5A00] text-white hover:bg-[#a75100]">
              <Plus className="h-4 w-4" />
              New team member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit team member' : 'Add team member'}</DialogTitle>
                <DialogDescription>
                  Keep personnel information accurate to reinforce credibility and trust.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role / title</Label>
                    <Input id="role" name="role" value={form.role} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Short biography</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Key achievements, experience, or leadership focus."
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                  <Label htmlFor="imageUrl">Profile image</Label>
                  {form.imageUrl && (
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                      <img src={form.imageUrl} alt={form.name} className="h-36 w-full object-cover" />
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
                  <p className="text-xs text-slate-500">Upload a headshot or paste an existing media URL.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Display order</Label>
                    <Input id="order" name="order" type="number" value={form.order} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinks">Social links</Label>
                  <Input
                    id="socialLinks"
                    name="socialLinks"
                    value={form.socialLinks}
                    onChange={handleChange}
                    placeholder="Format: platform|url, platform|url"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div>
                    <p className="font-medium text-[#0E293B] dark:text-white">Display profile</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Toggle to show or hide this leader on the public site.
                    </p>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(value) => setForm((prev) => ({ ...prev, isActive: value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="bg-[#BD5A00] text-white hover:bg-[#a75100]">
                  {submitting ? 'Saving…' : editing ? 'Save changes' : 'Add team member'}
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
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && orderedMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                  No team members added yet.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading team members…
                </TableCell>
              </TableRow>
            )}
            {orderedMembers.map((member) => (
              <TableRow key={member._id}>
                <TableCell className="font-semibold text-[#0E293B] dark:text-white">{member.name}</TableCell>
                <TableCell className="text-slate-500 dark:text-slate-400">{member.role}</TableCell>
                <TableCell>{member.order ?? '-'}</TableCell>
                <TableCell>
                  {member.isActive ? (
                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
                      Visible
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-300/40 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Hidden
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(member)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(member)}
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

