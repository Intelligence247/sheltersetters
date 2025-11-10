'use client'

import React from 'react'
import { ShieldAlert } from 'lucide-react'

import { useAuth } from '@/components/admin/auth-context'
import type { AdminRole } from '@/types/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  content_manager: 'Content Manager',
  customer_care: 'Customer Care',
}

interface RoleGateProps {
  allowed: AdminRole[]
  title?: string
  description?: string
  children?: React.ReactNode
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowed,
  title = 'Access restricted',
  description,
  children,
}) => {
  const { admin } = useAuth()

  if (!admin) {
    return null
  }

  const permitted = allowed.includes(admin.role)

  if (!permitted) {
    const roleList = allowed.map((role) => ROLE_LABELS[role]).join(' or ')
    return (
      <Card className="mx-auto max-w-3xl border-dashed border-[#BD5A00]/40 bg-white/80 shadow-sm backdrop-blur dark:bg-slate-900/70">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <ShieldAlert className="h-10 w-10 text-[#BD5A00]" />
          <CardTitle className="text-2xl font-semibold text-[#0E293B] dark:text-white">{title}</CardTitle>
          <CardDescription className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
            {description ??
              `Only ${roleList} ${
                allowed.length === 1 ? 'role' : 'roles'
              } can access this workspace. Contact a super admin if you believe you should have access.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">
          Current role: <span className="text-[#BD5A00]">{ROLE_LABELS[admin.role]}</span>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}


