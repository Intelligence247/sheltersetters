'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, KeyRound } from 'lucide-react'

import { useAuth } from '@/components/admin/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AdminRegisterPage() {
  const router = useRouter()
  const { admin, register, loading } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    registrationSecret: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (admin) {
      router.replace('/admin')
    }
  }, [admin, router])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await register(form)
      router.replace('/admin')
      toast.success('Administrator provisioned', {
        description: 'You now have access to the Shelter Setters admin console.',
      })
    } catch (error: any) {
      toast.error('Registration failed', {
        description:
          error?.body?.message ||
          'Please confirm the invitation secret is correct or contact a system administrator.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0E293B]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(189,90,0,0.35)_0%,_rgba(14,41,59,0.9)_60%,_rgba(14,41,59,1)_100%)]" />
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-2xl border-none bg-white/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between text-sm text-[#BD5A00]">
              <Link href="/" className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BD5A00]/30 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-[#BD5A00]">
                <Shield className="h-3 w-3" />
                Restricted
              </span>
            </div>
            <CardTitle className="text-2xl font-semibold text-[#0E293B]">Provision Admin Account</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Use the invite secret shared internally. Registration is monitored and restricted to authorised personnel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="registrationSecret" className="text-sm font-medium text-[#0E293B]">
                  Invitation secret
                </Label>
                <div className="relative">
              <input
                    id="registrationSecret"
                    name="registrationSecret"
                    type="password"
                    placeholder="Enter the invite code provided by the technical lead"
                    value={form.registrationSecret}
                    onChange={handleChange}
                    required
                    disabled={submitting || loading}
                className="auth-input pr-12"
                  />
                  <KeyRound className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BD5A00]" />
                </div>
                <p className="text-xs text-slate-400">
                  Contact the Shelter Setters technical administrator if you have not been issued an invite secret.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-[#0E293B]">
                  Full name
                </Label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={submitting || loading}
                  className="auth-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#0E293B]">
                  Work email
                </Label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@sheltersetters.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={submitting || loading}
                  className="auth-input"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#0E293B]">
                  Password
                </Label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={submitting || loading}
                  className="auth-input"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || loading}
                className="md:col-span-2 h-11 bg-[#BD5A00] text-white hover:bg-[#a75100]"
              >
                {submitting ? 'Provisioning…' : 'Create administrator account'}
              </Button>

              <div className="md:col-span-2 text-center text-xs text-slate-400">
                Already have access?{' '}
                <Link href="/admin/login" className="font-medium text-[#BD5A00] hover:underline">
                  Go to sign in
                </Link>
              </div>
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

