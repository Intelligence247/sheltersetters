'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { apiRequest, ApiError } from '@/lib/http-client'
import { STORAGE_KEYS } from '@/lib/config'
import type { AdminProfile, AuthResponse } from '@/types/admin'
import type { ApiResponse } from '@/types/api'

interface AuthContextValue {
  admin: AdminProfile | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (payload: { name: string; email: string; password: string; registrationSecret: string }) => Promise<AuthResponse>
  logout: () => Promise<void>
  requestPasswordReset: (email: string, baseUrl?: string) => Promise<void>
  completePasswordReset: (payload: { token: string; password: string }) => Promise<AuthResponse>
  refresh: () => Promise<string | null>
  setAdmin: React.Dispatch<React.SetStateAction<AdminProfile | null>>
  request: <T = unknown>(path: string, init?: RequestInit) => Promise<T>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readStorage = <T,>(key: string, fallback: T | null = null): T | null => {
  if (typeof window === 'undefined') return fallback
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    return fallback
  }
}

const writeStorage = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return
  if (value === null || value === undefined) {
    window.localStorage.removeItem(key)
  } else {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()

  const [admin, setAdmin] = useState<AdminProfile | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const persistSession = useCallback(
    (payload: AuthResponse | null) => {
      if (!payload) {
        setAdmin(null)
        setAccessToken(null)
        setRefreshToken(null)
        writeStorage(STORAGE_KEYS.accessToken, null)
        writeStorage(STORAGE_KEYS.refreshToken, null)
        writeStorage(STORAGE_KEYS.adminProfile, null)
        return
      }
      setAdmin(payload.admin)
      setAccessToken(payload.accessToken)
      setRefreshToken(payload.refreshToken)
      writeStorage(STORAGE_KEYS.accessToken, payload.accessToken)
      writeStorage(STORAGE_KEYS.refreshToken, payload.refreshToken)
      writeStorage(STORAGE_KEYS.adminProfile, payload.admin)
    },
    [setAdmin]
  )

  const refresh = useCallback(async (): Promise<string | null> => {
    if (!refreshToken) return null
    try {
      const response = await apiRequest<ApiResponse<AuthResponse>>('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      })
      persistSession(response.data)
      return response.data.accessToken
    } catch (error) {
      persistSession(null)
      if (pathname && pathname.startsWith('/admin')) {
        router.replace('/admin/login')
      }
      return null
    }
  }, [refreshToken, pathname, router, persistSession])

  const request = useCallback(
    async <T,>(path: string, init?: RequestInit) => {
      return apiRequest<T>(path, {
        ...init,
        auth: {
          accessToken,
          refresh,
        },
      })
    },
    [accessToken, refresh]
  )

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
      const response = await apiRequest<ApiResponse<AuthResponse>>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
      persistSession(response.data)
      return response.data
      } catch (error) {
        if (error instanceof ApiError) {
          throw error
        }
        throw new Error('Unable to login')
      } finally {
        setLoading(false)
      }
    },
    [persistSession]
  )

  const registerAdmin = useCallback(
    async (payload: { name: string; email: string; password: string; registrationSecret: string }) => {
      setLoading(true)
      try {
      const response = await apiRequest<ApiResponse<AuthResponse>>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      persistSession(response.data)
      return response.data
      } catch (error) {
        if (error instanceof ApiError) {
          throw error
        }
        throw new Error('Unable to register')
      } finally {
        setLoading(false)
      }
    },
    [persistSession]
  )

  const requestPasswordReset = useCallback(async (email: string, baseUrl?: string) => {
    await apiRequest<ApiResponse<{ success: boolean }>>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, baseUrl }),
    })
  }, [])

  const completePasswordReset = useCallback(
    async ({ token, password }: { token: string; password: string }) => {
      setLoading(true)
      try {
        const response = await apiRequest<ApiResponse<AuthResponse>>('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token, password }),
        })
        persistSession(response.data)
        return response.data
      } catch (error) {
        if (error instanceof ApiError) {
          throw error
        }
        throw new Error('Unable to reset password')
      } finally {
        setLoading(false)
      }
    },
    [persistSession]
  )

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await apiRequest<ApiResponse<{ success: boolean }>>('/api/auth/logout', {
          method: 'POST',
          auth: {
            accessToken,
            refresh,
          },
        })
      }
    } catch (error) {
      // ignore logout errors
    } finally {
      persistSession(null)
      router.replace('/admin/login')
    }
  }, [accessToken, persistSession, refresh, router])

  useEffect(() => {
    const storedAccess = readStorage<string>(STORAGE_KEYS.accessToken)
    const storedRefresh = readStorage<string>(STORAGE_KEYS.refreshToken)
    const storedProfile = readStorage<AdminProfile>(STORAGE_KEYS.adminProfile)

    if (storedAccess && storedRefresh && storedProfile) {
      setAdmin(storedProfile)
      setAccessToken(storedAccess)
      setRefreshToken(storedRefresh)
      setLoading(false)
    } else if (storedRefresh) {
      setRefreshToken(storedRefresh)
      refresh().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [refresh])

  const value = useMemo(
    () => ({
      admin,
      accessToken,
      refreshToken,
      loading,
      login,
      register: registerAdmin,
      logout,
      requestPasswordReset,
      completePasswordReset,
      refresh,
      setAdmin,
      request,
    }),
    [
      admin,
      accessToken,
      refreshToken,
      loading,
      login,
      registerAdmin,
      logout,
      requestPasswordReset,
      completePasswordReset,
      refresh,
      request,
      setAdmin,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

