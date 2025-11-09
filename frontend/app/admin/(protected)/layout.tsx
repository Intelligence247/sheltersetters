'use client'

import React from 'react'

import { AuthGuard } from '@/components/admin/auth-guard'
import { AdminShell } from '@/components/admin/admin-shell'

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  )
}

