'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft } from 'lucide-react'

import { useAuth } from '@/components/admin/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, admin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (admin) {
      router.replace('/admin')
    }
  }, [admin, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      router.replace('/admin')
      toast.success('Signed in', {
        description: 'Welcome back to the Shelter Setters admin console.',
      })
    } catch (error: any) {
      toast.error('Unable to sign in', {
        description: error?.body?.message || error?.message || 'Please verify your credentials and try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0E293B]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(189,90,0,0.35)_0%,_rgba(14,41,59,0.9)_60%,_rgba(14,41,59,1)_100%)]" />
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-none bg-white/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between text-sm text-[#BD5A00]">
              <Link href="/" className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BD5A00]/30 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-[#BD5A00]">
                <Shield className="h-3 w-3" />
                Secure
              </span>
            </div>
            <CardTitle className="text-2xl font-semibold text-[#0E293B]">Shelter Setters Admin</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Sign in with your administrator credentials to manage content and requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#0E293B]">
                  Email address
                </Label>
              <input
                id="email"
                type="email"
                placeholder="admin@sheltersetters.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={submitting || loading}
                className="auth-input"
              />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#0E293B]">
                  Password
                </Label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={submitting || loading}
                className="auth-input"
              />
              </div>
              <Button
                type="submit"
                disabled={submitting || loading}
                className="h-11 w-full bg-[#BD5A00] text-white hover:bg-[#a75100]"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
              <p className="text-center text-xs text-slate-400">
                Need an account? Use the invite secret on the{' '}
                <Link href="/admin/register" className="font-medium text-[#BD5A00] hover:underline">
                  admin provisioning page
                </Link>
                .
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="relative z-10 flex justify-center pb-6 text-xs uppercase tracking-[0.3em] text-white/60">
        © {new Date().getFullYear()} Shelter Setters Aluminium and Experts Nig. Ltd
      </div>
    </div>
  )
}

