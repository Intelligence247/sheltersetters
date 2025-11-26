'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import {
  Inbox,
  Loader2,
  Newspaper,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'

import { useAuth } from '@/components/admin/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ApiResponse } from '@/types/api'
import type { DashboardOverview } from '@/types/dashboard'

const statusStyles: Record<string, string> = {
  new: 'border-[#BD5A00]/20 bg-[#BD5A00]/10 text-[#BD5A00]',
  in_progress: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300',
  closed: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
}

const formatNumber = (value: number | undefined | null) => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return '—'
}

export default function AdminDashboardPage() {
  const { request } = useAuth()
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)

  const loadOverview = useCallback(async () => {
    setLoading(true)
    try {
      const response = await request<ApiResponse<DashboardOverview>>('/api/admin/dashboard/overview')
      setOverview(response.data)
    } catch (error: any) {
      toast.error('Unable to load dashboard', {
        description: error?.body?.message || 'Please try again shortly.',
      })
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    loadOverview()
  }, [loadOverview])

  const stats = useMemo(() => {
    const metrics = overview?.metrics
    return [
      {
        label: 'Open enquiries',
        value: metrics?.enquiries.open,
        sublabel: metrics ? `${formatNumber(metrics.enquiries.total)} total` : '',
        icon: Inbox,
        accent: 'text-[#BD5A00]',
      },
      {
        label: 'Live projects',
        value: metrics?.projects.live,
        sublabel: metrics ? `${formatNumber(metrics.projects.total)} total` : '',
        icon: TrendingUp,
        accent: 'text-blue-500',
      },
      {
        label: 'Active team members',
        value: metrics?.team.active,
        sublabel: metrics ? `${formatNumber(metrics.team.total)} total` : '',
        icon: Users,
        accent: 'text-emerald-500',
      },
      {
        label: 'Active services',
        value: metrics?.services.active,
        sublabel: metrics ? `${formatNumber(metrics.services.total)} total` : '',
        icon: Sparkles,
        accent: 'text-amber-500',
      },
      {
        label: 'Published news',
        value: metrics?.news.published,
        sublabel: metrics && metrics.news.published === 1 ? 'Most recent story live' : '',
        icon: Newspaper,
        accent: 'text-purple-500',
      },
    ]
  }, [overview])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 rounded-2xl border border-[#0E293B]/10 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-sm text-[#BD5A00]">
              <Sparkles className="h-4 w-4" />
              Dashboard overview
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real-time signal of enquiries, content, and team activity across the Shelter Setters platform.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-fit gap-2 border-[#BD5A00] text-[#BD5A00]"
            onClick={loadOverview}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map(({ label, value, sublabel, icon: Icon, accent }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-5 text-sm transition hover:border-[#BD5A00]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                {label}
                <Icon className={cn('h-4 w-4', accent)} />
              </div>
              <div className="mt-3 text-3xl font-semibold text-[#0E293B] dark:text-white">
                {loading && typeof value !== 'number' ? (
                  <span className="inline-flex h-7 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                ) : (
                  formatNumber(value)
                )}
              </div>
              {sublabel && (
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[#BD5A00]">{sublabel}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg text-[#0E293B] dark:text-white">Recent enquiries</CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Snapshot of the latest messages routed through the Shelter Setters contact desk.
              </CardDescription>
            </div>
            <Button asChild variant="outline" className="border-[#BD5A00] text-[#BD5A00]">
              <Link href="/admin/contact">Open contact desk</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60"
                  />
                ))}
              </div>
            ) : overview && overview.recentMessages.length > 0 ? (
              overview.recentMessages.map((message) => (
                <div
                  key={message._id}
                  className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0E293B] dark:text-white">{message.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{message.email}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'border text-[10px] uppercase tracking-[0.35em]',
                        statusStyles[message.status] ?? statusStyles.new
                      )}
                    >
                      {message.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{message.message}</p>
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                No enquiries received yet. New contact form submissions will appear here automatically.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-max sticky top-0 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-[#0E293B] dark:text-white">Need assistance?</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Reach out to the technical team if you need help managing admin features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Email: info@sheltersetters.com</p>
            <p>Phone: +234 901 447 6652</p>
            <p className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">We’re here to help</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

