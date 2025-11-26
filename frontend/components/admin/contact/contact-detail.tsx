'use client'

import React, { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Mail, Phone, User, Clock, Send } from 'lucide-react'

import type { ContactMessage, ContactStatus } from '@/types/contact'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const statusLabels: Record<ContactStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  closed: 'Closed',
}

interface ContactDetailProps {
  message?: ContactMessage | null
  onUpdateStatus: (status: ContactStatus) => Promise<void>
  onSendReply: (payload: { reply: string; status: ContactStatus }) => Promise<void>
  sending?: boolean
}

export const ContactDetail = ({ message, onUpdateStatus, onSendReply, sending }: ContactDetailProps) => {
  const [status, setStatus] = useState<ContactStatus>(message?.status ?? 'new')
  const [reply, setReply] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  React.useEffect(() => {
    if (message) {
      setStatus(message.status)
      setReply('')
    }
  }, [message?._id, message?.status])

  const formattedDates = useMemo(() => {
    if (!message) return {}
    return {
      received: format(new Date(message.createdAt), 'PPpp'),
      responded: message.respondedAt ? format(new Date(message.respondedAt), 'PPpp') : null,
    }
  }, [message])

  if (!message) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        Select a message to view details and respond.
      </div>
    )
  }

  const handleStatusChange = async (value: ContactStatus) => {
    setStatus(value)
    setUpdatingStatus(true)
    try {
      await onUpdateStatus(value)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!reply.trim()) return
    await onSendReply({ reply, status })
    setReply('')
  }

  return (
    <div className="sticky top-0 h-full max-h-[calc(100vh-10rem)] flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#0E293B] dark:text-white">{message.name}</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">Contact Request</p>
          </div>
          <Badge variant="outline" className="border border-[#BD5A00]/20 bg-[#BD5A00]/10 text-xs uppercase tracking-[0.3em] text-[#BD5A00]">
            {statusLabels[message.status]}
          </Badge>
        </div>
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#BD5A00]" />
            {message.email}
          </div>
          {message.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#BD5A00]" />
              {message.phone}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#BD5A00]" />
            Received {formattedDates.received}
          </div>
          {formattedDates.responded && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#BD5A00]" />
              Responded {formattedDates.responded}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-xl bg-slate-50/80 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">Client message</p>
        <p className="whitespace-pre-line">{message.message}</p>
        {message.reply && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-600 dark:text-emerald-300">
            <p className="uppercase tracking-[0.3em]">Last reply</p>
            <p className="mt-2 whitespace-pre-line text-sm text-emerald-700 dark:text-emerald-200">{message.reply}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[200px_1fr]">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-semibold text-[#0E293B] dark:text-white">
              Update status
            </Label>
            <Select value={status} onValueChange={(value) => handleStatusChange(value as ContactStatus)} disabled={updatingStatus || sending}>
              <SelectTrigger className="border-slate-200 focus:border-[#BD5A00] focus:ring-[#BD5A00]/20 dark:border-slate-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleReplySubmit}>
            <div className="space-y-2">
              <Label htmlFor="reply" className="text-sm font-semibold text-[#0E293B] dark:text-white">
                Send a reply
              </Label>
              <Textarea
                id="reply"
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Draft your message to the client…"
                rows={5}
                className="resize-none border-slate-200 focus:border-[#BD5A00] focus-visible:ring-[#BD5A00]/20 dark:border-slate-700"
              />
            </div>
            <Button
              type="submit"
              className="self-end bg-[#BD5A00] text-white hover:bg-[#a75100]"
              disabled={sending || !reply.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              {sending ? 'Sending…' : 'Send reply'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

