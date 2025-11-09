'use client'

import React from 'react'
import { Sparkles, TrendingUp, Users, Inbox } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  { label: 'Open enquiries', value: '12', icon: Inbox, change: '+4.2%' },
  { label: 'Team members', value: '8', icon: Users, change: 'Stable' },
  { label: 'Live projects', value: '5', icon: TrendingUp, change: '+1 new' },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#0E293B]/10 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-sm text-[#BD5A00]">
          <Sparkles className="h-4 w-4" />
          Dashboard overview
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, change }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-5 text-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                {label}
                <Icon className="h-4 w-4 text-[#BD5A00]" />
              </div>
              <div className="mt-3 text-2xl font-semibold text-[#0E293B] dark:text-white">{value}</div>
              <div className="mt-2 text-xs text-[#BD5A00]">{change}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-[#0E293B] dark:text-white">Next steps</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Choose a section from the navigation to begin managing content or enquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p>
              The admin console is your central hub for managing Shelter Setters digital presence. Use the navigation
              to review enquiries, publish news updates, and keep project information current.
            </p>
            <p className="rounded-lg bg-slate-100/80 p-4 text-xs uppercase tracking-[0.25em] text-[#0E293B] dark:bg-slate-800/60">
              All actions sync in real-time with the public website
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-[#0E293B] dark:text-white">Need assistance?</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Reach out to the technical team if you need help managing admin features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Email: support@sheltersetters.com</p>
            <p>Phone: +234 901 447 6652</p>
            <p className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">We’re here to help</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

