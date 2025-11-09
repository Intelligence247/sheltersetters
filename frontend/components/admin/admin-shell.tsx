'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, LayoutDashboard, MessageSquare, FileText, Users, Settings } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/components/admin/auth-context'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Contact Desk', href: '/admin/contact', icon: MessageSquare },
  { label: 'Content', href: '/admin/content', icon: FileText },
  { label: 'Team & Projects', href: '/admin/team-projects', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

const Sidebar = () => {
  const pathname = usePathname()
  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Shelter Setters</span>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">Admin Console</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-[#0E293B] text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

const MobileNav = () => {
  const pathname = usePathname()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-white px-0 py-0 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              Shelter Setters
            </span>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">Admin Console</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-4 py-6">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#0E293B] text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const { admin, logout } = useAuth()
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <MobileNav />
            <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{admin?.name}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#BD5A00]">{admin?.role}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2 border-[#BD5A00] text-[#BD5A00]">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

