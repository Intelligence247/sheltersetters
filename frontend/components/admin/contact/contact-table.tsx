'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Mail, Phone } from 'lucide-react'

import type { ContactMessage, ContactStatus } from '@/types/contact'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusBadge: Record<ContactStatus, string> = {
  new: 'bg-[#BD5A00]/10 text-[#BD5A00] border-[#BD5A00]/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  closed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
}

interface ContactTableProps {
  messages: ContactMessage[]
  onSelect: (message: ContactMessage) => void
  selectedId?: string | null
  loading?: boolean
}

export const ContactTable = ({ messages, onSelect, selectedId, loading }: ContactTableProps) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Loading contact messages…
      </div>
    )
  }

  if (!messages.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        No messages found for the selected filter.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50/60 text-left uppercase tracking-[0.25em] text-slate-400 dark:bg-slate-900/40 dark:text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Enquiry</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {messages.map((message) => {
              const active = selectedId === message._id
              return (
                <tr
                  key={message._id}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                    active && 'bg-[#0E293B]/5 dark:bg-[#0E293B]/10'
                  )}
                  onClick={() => onSelect(message)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-[#0E293B] dark:text-white">{message.name}</span>
                      <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{message.message}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-300">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-3 w-3 text-[#BD5A00]" />
                        {message.email}
                      </span>
                      {message.phone && (
                        <span className="inline-flex items-center gap-2">
                          <Phone className="h-3 w-3 text-[#BD5A00]" />
                          {message.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={cn('border text-xs font-semibold uppercase tracking-[0.3em]', statusBadge[message.status])}
                    >
                      {message.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

