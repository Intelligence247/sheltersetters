'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Loader2, Mail, ShieldPlus, ShieldCheck, UserCheck, UserX, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/admin/auth-context'
import type { ApiResponse } from '@/types/api'
import type { AdminProfile, AdminRole } from '@/types/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ROLE_METADATA: Record<
  AdminRole,
  { label: string; description: string; emphasis: 'default' | 'destructive' | 'secondary' }
> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full access to every module and administrator management.',
    emphasis: 'default',
  },
  content_manager: {
    label: 'Content Manager',
    description: 'Can manage services, news, projects, and team information.',
    emphasis: 'secondary',
  },
  customer_care: {
    label: 'Customer Care',
    description: 'Limited to contact desk triage and follow-up replies.',
    emphasis: 'secondary',
  },
}

const DEFAULT_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'content_manager' as AdminRole,
}

export const AdminManagementPanel = () => {
  const { admin, request } = useAuth()
  const isSuperAdmin = admin?.role === 'super_admin'

  const [records, setRecords] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [pendingIds, setPendingIds] = useState<string[]>([])
  const [form, setForm] = useState(DEFAULT_FORM)

  useEffect(() => {
    if (!isSuperAdmin) return
    let mounted = true

    const loadAdmins = async () => {
      setLoading(true)
      try {
        const response = await request<ApiResponse<{ admins: AdminProfile[] }>>('/api/admin/users')
        if (mounted) {
          setRecords(response.data.admins)
        }
      } catch (error: any) {
        toast.error('Unable to load administrator registry', {
          description: error?.body?.message || 'Please refresh and try again.',
        })
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadAdmins()
    return () => {
      mounted = false
    }
  }, [isSuperAdmin, request])

  const markPending = (id: string, next: boolean) => {
    setPendingIds((prev) => {
      if (next) {
        if (prev.includes(id)) return prev
        return [...prev, id]
      }
      return prev.filter((item) => item !== id)
    })
  }

  const sortedAdmins = useMemo(() => {
    return [...records].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [records])

  const filteredAdmins = useMemo(() => {
    if (!search.trim()) return sortedAdmins
    const term = search.trim().toLowerCase()
    return sortedAdmins.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        ROLE_METADATA[item.role].label.toLowerCase().includes(term)
    )
  }, [search, sortedAdmins])

  const handleCreateAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isSuperAdmin) return

    setCreating(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }

      const response = await request<ApiResponse<{ admin: AdminProfile }>>('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setRecords((prev) => {
        const next = prev.filter((item) => item._id !== response.data.admin._id)
        return [response.data.admin, ...next]
      })
      setForm(DEFAULT_FORM)
      toast.success('Administrator provisioned', {
        description: 'Share the temporary password securely and request a password update.',
      })
    } catch (error: any) {
      toast.error('Unable to create administrator', {
        description: error?.body?.message || 'Please confirm details and try again.',
      })
    } finally {
      setCreating(false)
    }
  }

  const applyUpdate = async (id: string, body: Partial<Pick<AdminProfile, 'role' | 'isActive'>>) => {
    markPending(id, true)
    try {
      const response = await request<ApiResponse<{ admin: AdminProfile }>>(`/api/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      setRecords((prev) =>
        prev.map((item) => (item._id === response.data.admin._id ? response.data.admin : item))
      )
      toast.success('Administrator updated', {
        description: 'Permissions and status have been adjusted.',
      })
    } catch (error: any) {
      toast.error('Unable to update administrator', {
        description: error?.body?.message || 'No changes were applied.',
      })
    } finally {
      markPending(id, false)
    }
  }

  const handleRoleChange = (id: string, nextRole: AdminRole) => {
    applyUpdate(id, { role: nextRole })
  }

  const handleStatusToggle = (id: string, nextStatus: boolean) => {
    applyUpdate(id, { isActive: nextStatus })
  }

  if (!isSuperAdmin) {
    return null
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-[#0E293B] dark:text-white">
          <ShieldPlus className="h-5 w-5 text-[#BD5A00]" />
          Administrator management
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
          Invite trusted team members, assign least-privilege roles, and suspend access when duties
          change.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
          <div className="mb-5 flex flex-col gap-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#BD5A00]">
              <UserPlus className="h-4 w-4" />
              Provision new administrator
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The initial password should be shared over a secure channel. Encourage recipients to
              reset their password after first sign-in.
            </p>
          </div>
          <form className="grid gap-4 md:grid-cols-2 w-full grid-cols-1" onSubmit={handleCreateAdmin}>
            <div className="space-y-2">
              <Label htmlFor="admin-name" className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Full name
              </Label>
              <Input
                id="admin-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Work email
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="admin@sheltersetters.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-xs uppercase tracking-[0.2em] text-slate-500"
              >
                Temporary password
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.2em] text-slate-500">Role</Label>
              <Select
                value={form.role}
                onValueChange={(role) => setForm((prev) => ({ ...prev, role: role as AdminRole }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_METADATA).map(([value, role]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{role.label}</span>
                        <span className="md:text-[10px] text-[9px] text-slate-500">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 xl:col-span-4">
              <Button
                type="submit"
                disabled={creating}
                className="w-full gap-2 bg-[#BD5A00] text-white hover:bg-[#a75100]"
              >
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                Invite administrator
              </Button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0E293B] dark:text-white">
                Current registry
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredAdmins.length} administrator{filteredAdmins.length === 1 ? '' : 's'} match
                the current filters.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, or role"
                className="w-full min-w-[220px] max-w-full sm:max-w-xs"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-[#BD5A00]" />
                Loading administrators…
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-10 w-10 text-[#BD5A00]" />
                <p>No administrators match the current filters.</p>
                <p className="text-xs">
                  Adjust your search or invite a new administrator using the form above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name & contact</TableHead>
                      <TableHead className="min-w-[180px]">Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="min-w-[160px]">Access</TableHead>
                      <TableHead className="hidden min-w-[180px] lg:table-cell">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map((item) => {
                      const roleMeta = ROLE_METADATA[item.role]
                      const isSelf = item._id === admin?._id
                      const isPending = pendingIds.includes(item._id)
                      const createdAt = new Date(item.createdAt).toLocaleString()
                      const lastSeen = item.lastLoginAt
                        ? new Date(item.lastLoginAt).toLocaleString()
                        : 'Not recorded'
                      return (
                        <TableRow key={item._id} className="align-top">
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-[#0E293B] dark:text-white">
                                  {item.name}
                                </span>
                                {isSelf && (
                                  <Badge variant="secondary" className="uppercase tracking-[0.25em]">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Mail className="h-3.5 w-3.5 text-[#BD5A00]" />
                                {item.email}
                              </div>
                              <div className="text-xs text-slate-400 dark:text-slate-500">
                                Last sign in: {lastSeen}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.role}
                              disabled={isSelf || isPending}
                              onValueChange={(value) => handleRoleChange(item._id, value as AdminRole)}
                            >
                              <SelectTrigger
                                className="w-full sm:w-[190px]"
                                aria-label="Administrator role selector"
                              >
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(ROLE_METADATA).map(([value, meta]) => (
                                  <SelectItem key={value} value={value}>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{meta.label}</span>
                                      <span className="text-xs text-slate-500">{meta.description}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              <Badge
                                variant={item.isActive ? 'default' : 'destructive'}
                                className="w-fit uppercase tracking-[0.3em]"
                              >
                                {item.isActive ? 'Active' : 'Suspended'}
                              </Badge>
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {roleMeta.description}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap items-center gap-3">
                              <Switch
                                id={`status-${item._id}`}
                                checked={item.isActive}
                                disabled={isSelf || isPending}
                                onCheckedChange={(checked) => handleStatusToggle(item._id, checked)}
                              />
                              <label
                                htmlFor={`status-${item._id}`}
                                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                              >
                                {item.isActive ? (
                                  <>
                                    <UserCheck className="h-4 w-4 text-[#BD5A00]" />
                                    Enabled
                                  </>
                                ) : (
                                  <>
                                    <UserX className="h-4 w-4 text-[#BD5A00]" />
                                    Disabled
                                  </>
                                )}
                              </label>
                              {isPending && <Loader2 className="h-4 w-4 animate-spin text-[#BD5A00]" />}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="text-sm text-slate-500 dark:text-slate-400">{createdAt}</div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

export default AdminManagementPanel

