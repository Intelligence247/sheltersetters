'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, KeyRound, Lock, Mail, RefreshCcw, Settings, ShieldCheck, User2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/admin/auth-context'
import type { ApiResponse } from '@/types/api'
import type { AdminProfile } from '@/types/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : ''

export default function AdminSettings() {
  const {
    admin,
    logout,
    refresh,
    requestPasswordReset,
    completePasswordReset,
    request,
    setAdmin,
  } = useAuth()

  const [profile, setProfile] = useState<AdminProfile | null>(admin)
  const [baseUrl, setBaseUrl] = useState(fallbackOrigin)
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetEmailLoading, setResetEmailLoading] = useState(false)
  const [resetSubmitting, setResetSubmitting] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
      try {
        const response = await request<ApiResponse<{ admin: AdminProfile }>>('/api/auth/me')
        if (mounted) {
          setProfile(response.data.admin)
          setAdmin(response.data.admin)
        }
      } catch (error: any) {
        toast.error('Unable to load profile details', {
          description: error?.body?.message || 'Please try again shortly.',
        })
      }
    }
    loadProfile()
    return () => {
      mounted = false
    }
  }, [request, setAdmin])

  const formattedLastLogin = useMemo(() => {
    if (!profile?.lastLoginAt) return 'Not available'
    return new Date(profile.lastLoginAt).toLocaleString()
  }, [profile?.lastLoginAt])

  const handlePasswordEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profile?.email) return
    setResetEmailLoading(true)
    try {
      await requestPasswordReset(profile.email, baseUrl || undefined)
      toast.success('Password reset email sent', {
        description: 'Check your inbox for instructions to update your password.',
      })
    } catch (error: any) {
      toast.error('Unable to send reset email', {
        description: error?.body?.message || 'Please try again or contact support.',
      })
    } finally {
      setResetEmailLoading(false)
    }
  }

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!resetToken || !newPassword) return
    setResetSubmitting(true)
    try {
      await completePasswordReset({ token: resetToken, password: newPassword })
      setResetToken('')
      setNewPassword('')
      toast.success('Password updated', {
        description: 'Your session has been refreshed with the new credentials.',
      })
    } catch (error: any) {
      toast.error('Unable to reset password', {
        description: error?.body?.message || 'Please confirm the token and try again.',
      })
    } finally {
      setResetSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0E293B] dark:text-white">
              <User2 className="h-5 w-5 text-[#BD5A00]" />
              Administrator profile
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Review the metadata associated with your Shelter Setters admin account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">Name</span>
              <span className="text-lg font-semibold text-[#0E293B] dark:text-white">
                {profile?.name ?? '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">Email</span>
              <span className="inline-flex items-center gap-2 text-[#0E293B] dark:text-white">
                <Mail className="h-4 w-4 text-[#BD5A00]" />
                {profile?.email ?? '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">Role</span>
              <span className="flex items-center gap-2 uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-[#BD5A00]" />
                {profile?.role ?? '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">Last sign in</span>
              <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-300">
                <CalendarCheck className="h-4 w-4 text-[#BD5A00]" />
                {formattedLastLogin}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">
                Internal notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="Optional notes about this account (local only)."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0E293B] dark:text-white">
              <Lock className="h-5 w-5 text-[#BD5A00]" />
              Password management
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Send a reset link to your inbox or use a token to set a new password manually.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
            <form className="space-y-3" onSubmit={handlePasswordEmail}>
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Password reset link base URL</Label>
                <Input
                  id="baseUrl"
                  value={baseUrl}
                  onChange={(event) => setBaseUrl(event.target.value)}
                  placeholder="https://sheltersetters.com/admin/reset"
                />
              </div>
              <Button
                type="submit"
                disabled={resetEmailLoading || !profile?.email}
                className="bg-[#BD5A00] text-white hover:bg-[#a75100]"
              >
                {resetEmailLoading ? 'Sending…' : 'Email reset instructions'}
              </Button>
            </form>

            <div className="border-t border-slate-200 pt-4 text-xs uppercase tracking-[0.3em] text-[#BD5A00] dark:border-slate-800">
              Or apply reset token directly
            </div>

            <form className="space-y-3" onSubmit={handlePasswordReset}>
              <div className="space-y-2">
                <Label htmlFor="resetToken">Reset token</Label>
                <Input
                  id="resetToken"
                  value={resetToken}
                  onChange={(event) => setResetToken(event.target.value)}
                  placeholder="Paste the token from the email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
              </div>
              <Button
                type="submit"
                disabled={resetSubmitting}
                className="bg-[#0E293B] text-white hover:bg-[#0c2333]"
              >
                {resetSubmitting ? 'Updating…' : 'Apply password reset'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0E293B] dark:text-white">
            <Settings className="h-5 w-5 text-[#BD5A00]" />
            Session controls
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
            Rotate your tokens or exit securely when sharing machines.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2 border-[#BD5A00] text-sm font-medium text-[#BD5A00]"
            onClick={async () => {
              try {
                await refresh()
                toast.success('Session refreshed', {
                  description: 'New access and refresh tokens have been issued.',
                })
              } catch (error: any) {
                toast.error('Refresh failed', {
                  description: error?.body?.message || 'Please sign in again.',
                })
              }
            }}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh session
          </Button>
          <Button
            className="gap-2 bg-[#BD5A00] text-sm font-medium text-white hover:bg-[#a75100]"
            onClick={logout}
          >
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
