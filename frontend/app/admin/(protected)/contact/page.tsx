'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Mail, RefreshCcw, Search } from 'lucide-react'

import type { ContactMessage, ContactStatus, ContactListResult } from '@/types/contact'
import type { ApiResponse } from '@/types/api'
import { useAuth } from '@/components/admin/auth-context'
import { ContactTable } from '@/components/admin/contact/contact-table'
import { ContactDetail } from '@/components/admin/contact/contact-detail'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { RoleGate } from '@/components/admin/role-gate'

const statusFilters: { label: string; value: ContactStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Closed', value: 'closed' },
]

export default function AdminContactDesk() {
  const { request } = useAuth()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingReply, setSendingReply] = useState(false)
  const [updating, setUpdating] = useState(false)

  const fetchMessages = async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const searchParams = new URLSearchParams()
      if (statusFilter !== 'all') {
        searchParams.set('status', statusFilter)
      }
      searchParams.set('limit', '20')
      const response = await request<ApiResponse<ContactListResult>>(`/api/contact?${searchParams.toString()}`, {
        signal,
      })
      const items = response.data.messages
      setMessages(items)
      setSelected((prev) => {
        if (!items.length) return null
        if (prev) {
          const match = items.find((item) => item._id === prev._id)
          if (match) return match
        }
        return items[0]
      })
    } catch (error: any) {
      if (error?.name === 'AbortError') return
      toast.error('Unable to load messages', {
        description: error?.body?.message || 'Please try again shortly.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchMessages(controller.signal)
    return () => controller.abort()
  }, [statusFilter])

  const handleStatusChange = async (messageId: string, status: ContactStatus) => {
    setUpdating(true)
    try {
      const response = await request<ApiResponse<{ message: ContactMessage }>>(`/api/contact/${messageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      const updated = response.data.message
      setMessages((prev) =>
        prev.map((message) => (message._id === messageId ? updated : message))
      )
      setSelected((prev) => (prev && prev._id === messageId ? updated : prev))
      toast.success('Status updated', {
        description: 'The enquiry status has been updated successfully.',
      })
    } catch (error: any) {
      toast.error('Status update failed', {
        description: error?.body?.message || 'Please try again.',
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleReply = async (messageId: string, payload: { reply: string; status: ContactStatus }) => {
    setSendingReply(true)
    try {
      const response = await request<ApiResponse<{ message: ContactMessage }>>(`/api/contact/${messageId}/reply`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      const updated = response.data.message
      setMessages((prev) =>
        prev.map((message) => (message._id === messageId ? updated : message))
      )
      setSelected((prev) =>
        prev && prev._id === messageId ? updated : prev
      )
      toast.success('Reply sent', {
        description: 'The client has been notified via email.',
      })
    } catch (error: any) {
      toast.error('Reply failed', {
        description: error?.body?.message || 'Unable to send email response at this time.',
      })
    } finally {
      setSendingReply(false)
    }
  }

  // Filter messages by search query (client-side)
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages
    const query = searchQuery.toLowerCase()
    return messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query) ||
        (msg.phone && msg.phone.includes(query))
    )
  }, [messages, searchQuery])

  const summaryCounts = useMemo(() => {
    return filteredMessages.reduce(
      (acc, message) => {
        acc.total += 1
        acc[message.status] += 1
        return acc
      },
      { total: 0, new: 0, in_progress: 0, closed: 0 } as Record<ContactStatus | 'total', number>
    )
  }, [filteredMessages])

  return (
    <RoleGate allowed={['super_admin', 'customer_care']}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 md:px-6 lg:px-8">
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-[#0E293B] dark:text-white">
              <Mail className="h-5 w-5 text-[#BD5A00]" />
              Contact desk
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Track inbound enquiries, update statuses, and respond directly with email follow-ups.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[180px] pl-9 border-slate-200 focus:border-[#BD5A00] focus:ring-[#BD5A00]/20 dark:border-slate-700"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ContactStatus | 'all')}>
              <SelectTrigger className="w-[140px] border-slate-200 focus:border-[#BD5A00] focus:ring-[#BD5A00]/20 dark:border-slate-700">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-[#BD5A00] text-[#BD5A00]"
              onClick={() => fetchMessages()}
              disabled={loading}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-xs uppercase tracking-[0.25em] text-[#0E293B] dark:text-slate-200 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p>Total enquiries</p>
              <p className="mt-2 text-2xl font-semibold">{summaryCounts.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p>New</p>
              <p className="mt-2 text-2xl font-semibold text-[#BD5A00]">{summaryCounts.new}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p>In progress</p>
              <p className="mt-2 text-2xl font-semibold text-blue-500">{summaryCounts.in_progress}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p>Closed</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-500">{summaryCounts.closed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile: show list or detail based on selection */}
      <div className="block xl:hidden">
        {selected ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-sm text-[#BD5A00] hover:underline"
            >
              ← Back to messages
            </button>
            <ContactDetail
              message={selected}
              onUpdateStatus={(status) => handleStatusChange(selected._id, status)}
              onSendReply={(payload) => handleReply(selected._id, payload)}
              sending={sendingReply || updating}
            />
          </div>
        ) : (
          <ContactTable
            messages={filteredMessages}
            onSelect={setSelected}
            selectedId={null}
            loading={loading}
          />
        )}
      </div>

      {/* Desktop/Tablet: side-by-side layout */}
      <div className="hidden xl:grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ContactTable
          messages={filteredMessages}
          onSelect={setSelected}
          selectedId={selected?._id ?? null}
          loading={loading}
        />
        <ContactDetail
          message={selected}
          onUpdateStatus={(status) => (selected ? handleStatusChange(selected._id, status) : Promise.resolve())}
          onSendReply={(payload) => (selected ? handleReply(selected._id, payload) : Promise.resolve())}
          sending={sendingReply || updating}
        />
      </div>
      </div>
    </RoleGate>
  )
}

