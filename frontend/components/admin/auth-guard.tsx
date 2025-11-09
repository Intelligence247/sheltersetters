'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { useAuth } from '@/components/admin/auth-context'
import { Spinner } from '@/components/ui/spinner'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { admin, loading, refreshToken } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !admin) {
      router.replace('/admin/login')
    }
  }, [admin, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-white" />
          <span className="text-sm uppercase tracking-[0.3em] text-slate-300">Loading Admin Portal</span>
        </div>
      </div>
    )
  }

  if (!admin && !refreshToken) {
    return null
  }

  return <>{children}</>
}

