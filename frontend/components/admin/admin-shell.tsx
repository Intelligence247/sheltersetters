'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, LayoutDashboard, MessageSquare, FileText, Users, Settings } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/components/admin/auth-context'
import type { AdminRole } from '@/types/admin'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: AdminRole[]
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Contact Desk', href: '/admin/contact', icon: MessageSquare, roles: ['super_admin', 'customer_care'] },
  { label: 'Content', href: '/admin/content', icon: FileText, roles: ['super_admin', 'content_manager'] },
  { label: 'Team & Projects', href: '/admin/team-projects', icon: Users, roles: ['super_admin', 'content_manager'] },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  content_manager: 'Content Manager',
  customer_care: 'Customer Care',
}

const Sidebar = () => {
  const pathname = usePathname()
  const { admin } = useAuth()
  const role = admin?.role

  const allowedItems = navItems.filter((item) => {
    if (!item.roles || !role) return true
    return item.roles.includes(role)
  })

  return (
    <aside className="hidden flex-shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex lg:h-full lg:w-64 lg:overflow-y-auto">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Shelter Setters</span>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">Admin Console</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {allowedItems.map(({ label, href, icon: Icon }) => {
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
  const { admin } = useAuth()
  const role = admin?.role
  const [open, setOpen] = React.useState(false)

  const allowedItems = navItems.filter((item) => {
    if (!item.roles || !role) return true
    return item.roles.includes(role)
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
          {allowedItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
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
  const pathname = usePathname()
  const activeNav = navItems.find((item) => item.href === pathname)
  const heading = activeNav?.label ?? 'Dashboard'
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="hidden lg:block lg:h-full lg:w-64 lg:overflow-hidden lg:bg-white lg:dark:bg-slate-900">
        <div className="h-full">
          <Sidebar />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <MobileNav />
            <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">{heading}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{admin?.name}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#BD5A00]">
                {admin?.role ? ROLE_LABELS[admin.role] : ''}
              </span>
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

