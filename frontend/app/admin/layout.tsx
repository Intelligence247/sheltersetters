'use client'

import React from 'react'

import { AuthProvider } from '@/components/admin/auth-context'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

